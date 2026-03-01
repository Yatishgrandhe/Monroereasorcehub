'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    Float,
    ContactShadows,
    PerspectiveCamera,
    Environment,
    MeshTransmissionMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Search, Sparkles, ArrowRight, Zap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

// --- 3D Components ---

function ResourceCore() {
    const meshRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    const { viewport, mouse } = useThree();
    const [hovered, setHovered] = useState(false);

    const targetPos = useRef(new THREE.Vector3());
    const currentPos = useRef(new THREE.Vector3());
    const mouseSmoothing = 0.08;

    useFrame((state) => {
        if (!meshRef.current) return;
        targetPos.current.set((mouse.x * viewport.width) / 2.5, (mouse.y * viewport.height) / 2.5, 0);
        currentPos.current.lerp(targetPos.current, mouseSmoothing);
        meshRef.current.position.copy(currentPos.current);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, (mouse.x * Math.PI) / 4, 0.05);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -(mouse.y * Math.PI) / 4, 0.05);
        if (lightRef.current) {
            lightRef.current.intensity = 25 + Math.sin(state.clock.elapsedTime * 4) * 12;
        }
    });

    return (
        <group>
            <Float speed={3} rotationIntensity={0.8} floatIntensity={2} floatingRange={[-0.4, 0.4]}>
                <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} scale={1.5}>
                    <sphereGeometry args={[1, 48, 48]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={6}
                        thickness={2.0}
                        chromaticAberration={0.12}
                        anisotropy={0.3}
                        distortion={0.4}
                        distortionScale={0.5}
                        temporalDistortion={0.15}
                        iridescence={1}
                        iridescenceIOR={1}
                        iridescenceThicknessRange={[100, 400]}
                        color={hovered ? "#1e40af" : "#0f172a"}
                        roughness={0.05}
                        ior={1.4}
                        transmission={0.8}
                    />
                    <pointLight ref={lightRef} color="#2563eb" intensity={40} distance={8} />
                </mesh>
            </Float>
            <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={15} blur={2.5} far={5} color="#000000" />
        </group>
    );
}

function Experience() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
            {/* Removed Environment to avoid potential white-out on context issues */}
            <ambientLight intensity={0.5} />
            <spotLight position={[15, 15, 15]} angle={0.2} penumbra={1} intensity={3} color="#2563eb" />
            <spotLight position={[-15, -15, 10]} angle={0.2} penumbra={1} intensity={2} color="#0d9488" />
            <Suspense fallback={null}>
                <ResourceCore />
            </Suspense>
        </>
    );
}

export function Hero3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [webglSupported, setWebglSupported] = useState(true);

    useEffect(() => {
        setMounted(true);
        // Robust WebGL check
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl', { alpha: true }) || canvas.getContext('experimental-webgl', { alpha: true });
            if (!gl) setWebglSupported(false);
        } catch (e) {
            setWebglSupported(false);
        }
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const springConfig = { damping: 28, stiffness: 90, mass: 1 };
    const canvasScale = useSpring(useTransform(scrollYProgress, [0, 0.65], [1, 0.35]), springConfig);
    const canvasX = useSpring(useTransform(scrollYProgress, [0, 0.65], ["0%", "42%"]), springConfig);
    const canvasY = useSpring(useTransform(scrollYProgress, [0, 0.65], ["0%", "-38%"]), springConfig);
    const canvasRotate = useSpring(useTransform(scrollYProgress, [0, 0.65], [0, 10]), springConfig);

    const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
    const contentY = useSpring(useTransform(scrollYProgress, [0, 0.35], [0, -60]), springConfig);

    return (
        <section ref={containerRef} className="relative w-full h-[100vh] bg-[#020617] overflow-visible selection:bg-primary-500/30">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-[#020617] z-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-40">
                    <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary-950/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-950/20 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)] pointer-events-none" />
            </div>

            {/* Sticky 3D Layer with explicit background protection */}
            {mounted && (
                <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10 pointer-events-none bg-transparent">
                    {webglSupported ? (
                        <motion.div
                            style={{
                                scale: canvasScale,
                                x: canvasX,
                                y: canvasY,
                                rotateZ: canvasRotate
                            }}
                            className="w-full h-full pointer-events-auto flex items-center justify-center bg-transparent"
                        >
                            <div className="w-full h-full max-w-[1600px] opacity-100">
                                <Canvas
                                    dpr={[1, 1.25]}
                                    camera={{ position: [0, 0, 10], fov: 35 }}
                                    gl={{
                                        alpha: true,
                                        antialias: true,
                                        powerPreference: 'high-performance',
                                        stencil: false,
                                        premultipliedAlpha: false
                                    }}
                                    style={{ background: 'transparent' }}
                                    onCreated={({ gl }) => {
                                        gl.setClearColor(0x000000, 0);
                                    }}
                                >
                                    <Experience />
                                </Canvas>
                            </div>
                        </motion.div>
                    ) : (
                        /* CSS Fallback if WebGL fails */
                        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-3xl animate-pulse" />
                    )}
                </div>
            )}

            {/* Hero Content Overlay */}
            <div className="absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-20 pointer-events-none px-6 sm:px-12 lg:px-20 overflow-visible">
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="text-center w-full pt-16 sm:pt-24 lg:pt-32 overflow-visible"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.1 }}
                    >
                        <Badge variant="glass" className="mb-8 sm:mb-12 px-6 py-2.5 border-white/10 bg-white/[0.05] text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] sm:text-[11px] backdrop-blur-xl">
                            <Sparkles className="w-3.5 h-3.5 mr-2.5 animate-pulse" />
                            Empowering Community Growth
                        </Badge>
                    </motion.div>

                    <h1 className="text-[11vw] sm:text-[9.5vw] lg:text-[7vw] xl:text-[7.5rem] 2xl:text-[8.5rem] font-black text-white leading-[0.85] tracking-tight sm:tracking-tighter mb-12 sm:mb-16 pointer-events-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-visible px-6 py-2">
                        Everything Monroe, <br />
                        <span className="text-gradient-logo pr-4 inline-block">In one place.</span>
                    </h1>

                    <div className="flex flex-col items-center gap-16 pointer-events-auto w-full max-w-4xl mx-auto">
                        <div className="relative group w-full max-w-2xl px-4">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full blur-xl group-hover:opacity-100 transition duration-700 opacity-0" />
                            <div className="relative flex items-center bg-black/60 backdrop-blur-3xl border border-white/10 rounded-full pl-8 pr-3 py-3.5 shadow-[0_25px_60px_rgba(0,0,0,0.7)] group-hover:border-primary-500/30 transition-all duration-300">
                                <Search className="w-5 h-5 text-slate-500 mr-4" />
                                <input
                                    type="text"
                                    placeholder="Find food assistance, housing, or career support in Monroe..."
                                    className="bg-transparent border-none outline-none text-white text-lg w-full placeholder:text-slate-600 font-medium"
                                />
                                <Button variant="gradient" className="rounded-full px-12 h-14 shadow-2xl shadow-primary-500/30 active:scale-95 transition-all text-base font-bold bg-gradient-to-r from-primary-600 to-accent-600">
                                    Search
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-x-12 gap-y-6 justify-center">
                            {[
                                { icon: Zap, label: "Resume AI", color: "text-primary-400" },
                                { icon: Briefcase, label: "Job Nexus", color: "text-accent-400" },
                                { icon: Sparkles, label: "Community", color: "text-emerald-400" }
                            ].map((item, i) => (
                                <button key={i} className="flex items-center gap-3 text-slate-500 text-[12px] font-black uppercase tracking-[0.3em] hover:text-white transition-all group">
                                    <item.icon className={cn("w-4.5 h-4.5", item.color)} />
                                    {item.label}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform opacity-0 group-hover:opacity-100" />
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
            <div className="h-[1vh]" />
        </section>
    );
}
