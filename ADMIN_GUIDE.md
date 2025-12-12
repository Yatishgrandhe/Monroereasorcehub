# Monroe Resource Hub - Admin Guide

## 🔐 Admin Access

### Getting Admin Access
1. Sign up for an account on the platform
2. Contact the development team to request admin privileges
3. Admin access is granted through the Supabase dashboard

### Admin Dashboard
Access the admin dashboard at `/admin` (requires authentication)

## 📊 Dashboard Overview

### Statistics
The admin dashboard displays:
- **Total Resources** - Number of approved resources in the system
- **Pending Resources** - Resources awaiting approval
- **Total Events** - Number of approved events
- **Pending Events** - Events awaiting approval

### Quick Actions
- **Manage Resources** - View and edit all resources
- **Manage Events** - View and edit all events
- **User Management** - Manage user accounts and permissions

## ✅ Resource Moderation

### Reviewing Pending Resources

1. **Access Pending Resources**
   - Navigate to the admin dashboard
   - View the "Pending Resources" section

2. **Review Resource Information**
   - **Basic Information**: Name, description, category
   - **Contact Details**: Email, phone, website, address
   - **Services & Population**: Services offered and target population
   - **Additional Info**: Contact person, title, submission date

3. **Approval Process**
   - **Approve**: Click "Approve" to publish the resource
   - **Reject**: Click "Reject" to remove the submission
   - **Edit**: Resources can be edited after approval

### Resource Categories
Resources are organized into these categories:
- Healthcare
- Education
- Food Assistance
- Housing
- Employment
- Mental Health
- Legal Services
- Transportation
- Childcare
- Senior Services
- Government Services
- Recreation
- Animal Services
- Social Services
- Veterans Services
- Emergency Services

## 📅 Event Moderation

### Reviewing Pending Events

1. **Access Pending Events**
   - Navigate to the admin dashboard
   - View the "Pending Events" section

2. **Review Event Information**
   - **Event Details**: Title, description, category
   - **Date & Time**: Start and end dates/times
   - **Location**: Event location and organizer
   - **Additional Info**: Website, contact information

3. **Approval Process**
   - **Approve**: Click "Approve" to publish the event
   - **Reject**: Click "Reject" to remove the submission

### Event Categories
Events are organized into these categories:
- Health & Wellness
- Education
- Community
- Employment
- Arts & Culture
- Sports & Recreation
- Business
- Volunteer

## 🔧 Database Management

### Adding New Categories

1. **Access Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to the Table Editor

2. **Add Category**
   - Open the `categories` table
   - Click "Insert" to add a new row
   - Fill in: `name`, `description`, `icon` (optional)

### Updating Resource Data

1. **Direct Database Updates**
   - Use the Supabase dashboard for bulk updates
   - Or use the data update scripts:
   ```bash
   npm run update-data
   ```

2. **Individual Resource Updates**
   - Use the admin dashboard to edit individual resources
   - Changes are reflected immediately

## 🚨 Troubleshooting

### Common Issues

1. **Resources Not Appearing**
   - Check if the resource is approved (`is_approved = true`)
   - Verify the category exists and is properly linked
   - Check for any database connection issues

2. **Events Not Showing**
   - Ensure events are approved and have valid dates
   - Check the event category configuration
   - Verify the calendar view settings

3. **User Authentication Issues**
   - Check Supabase Auth configuration
   - Verify environment variables are set correctly
   - Check user permissions in Supabase dashboard

### Performance Issues

1. **Slow Loading**
   - Check database query performance
   - Verify proper indexing on frequently queried columns
   - Monitor Supabase usage and limits

2. **API Errors**
   - Check Supabase service status
   - Verify API keys and permissions
   - Review error logs in Supabase dashboard

## 📈 Analytics & Monitoring

### Supabase Dashboard
- **Database Usage** - Monitor query performance and usage
- **Authentication** - Track user sign-ups and activity
- **Storage** - Monitor file uploads and storage usage
- **Logs** - Review error logs and system performance

### Key Metrics to Monitor
- **Daily Active Users** - Track platform engagement
- **Resource Views** - Monitor popular resources
- **Event Registrations** - Track event engagement
- **AI Feature Usage** - Monitor resume builder and job assistant usage

## 🔄 Maintenance Tasks

### Daily Tasks
- Review and approve pending resources
- Review and approve pending events
- Monitor system performance
- Check for any error reports

### Weekly Tasks
- Update resource information as needed
- Review and update event calendar
- Monitor user feedback and suggestions
- Check database performance metrics

### Monthly Tasks
- Review and update categories as needed
- Analyze usage statistics
- Update community information
- Review and update volunteer opportunities

## 📞 Support Contacts

### Technical Support
- **Development Team**: Central Academy of Technology and Arts TSA Chapter
- **Email**: tech@monroeresourcehub.org
- **Emergency**: (704) 283-0000

### Community Support
- **Union County Government**: (704) 283-3500
- **Monroe City Hall**: (704) 282-4500
- **Emergency Services**: 911

## 🔒 Security Best Practices

### Admin Account Security
- Use strong, unique passwords
- Enable two-factor authentication when available
- Regularly review admin access permissions
- Log out when not actively using the admin panel

### Data Protection
- Regularly backup the database
- Monitor for suspicious activity
- Keep software dependencies updated
- Follow data privacy regulations

## 📋 Admin Checklist

### New Resource Submission
- [ ] Verify organization legitimacy
- [ ] Check contact information accuracy
- [ ] Validate services and population served
- [ ] Ensure proper categorization
- [ ] Approve or reject with reason

### New Event Submission
- [ ] Verify event details and dates
- [ ] Check location and organizer information
- [ ] Ensure proper categorization
- [ ] Validate contact information
- [ ] Approve or reject with reason

### Weekly Review
- [ ] Check pending submissions
- [ ] Review system performance
- [ ] Monitor user feedback
- [ ] Update community information as needed
- [ ] Check for any technical issues

---

**Admin Guide v1.0 - Monroe Community Resource Hub**
