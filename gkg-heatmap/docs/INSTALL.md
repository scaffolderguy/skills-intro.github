# GKG Heatmap Visualizer - Installation Guide

This guide provides step-by-step instructions for installing and configuring the GKG Heatmap Visualizer system.

## System Requirements

### Server Environment
- **Operating System**: Linux (Ubuntu/CentOS recommended) or Unix-like system
- **Web Server**: Apache 2.4+ or Nginx 1.10+ with CGI support
- **PERL**: Version 5.10 or higher
- **Storage**: At least 1GB free space for temporary files and results
- **Memory**: Minimum 512MB RAM (2GB+ recommended for heavy usage)
- **Network**: Internet connection for GDELT data access

### Software Dependencies

#### Required PERL Modules
```bash
# Install via CPAN
cpan install CGI
cpan install JSON
cpan install MIME::Lite
cpan install Data::Dumper
cpan install File::Path
cpan install Time::HiRes
```

#### Optional but Recommended
```bash
# For enhanced functionality
cpan install DBI
cpan install DBD::mysql
cpan install Net::SMTP::SSL
cpan install Geo::Coder::Google
```

## Installation Steps

### 1. Download and Extract Files

```bash
# Create installation directory
sudo mkdir -p /var/www/gkg-heatmap
cd /var/www/gkg-heatmap

# Copy project files (adjust path as needed)
cp -r /path/to/gkg-heatmap/* .

# Set proper ownership
sudo chown -R www-data:www-data /var/www/gkg-heatmap
```

### 2. Configure Web Server

#### Apache Configuration

Create `/etc/apache2/sites-available/gkg-heatmap.conf`:

```apache
<VirtualHost *:80>
    ServerName gkg-heatmap.yourdomain.com
    DocumentRoot /var/www/gkg-heatmap
    
    # Enable CGI
    ScriptAlias /cgi-bin/ /var/www/gkg-heatmap/cgi-bin/
    <Directory "/var/www/gkg-heatmap/cgi-bin">
        AllowOverride None
        Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
        Require all granted
        AddHandler cgi-script .pl
    </Directory>
    
    # Static files
    <Directory "/var/www/gkg-heatmap">
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/gkg-heatmap_error.log
    CustomLog ${APACHE_LOG_DIR}/gkg-heatmap_access.log combined
</VirtualHost>
```

Enable the site:
```bash
sudo a2ensite gkg-heatmap
sudo a2enmod cgi
sudo systemctl reload apache2
```

#### Nginx Configuration

Add to nginx configuration:

```nginx
server {
    listen 80;
    server_name gkg-heatmap.yourdomain.com;
    root /var/www/gkg-heatmap;
    index index.html;
    
    # Static files
    location / {
        try_files $uri $uri/ =404;
    }
    
    # CGI scripts
    location ~ ^/cgi-bin/.*\.pl$ {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_pass unix:/var/run/fcgiwrap.socket;
    }
    
    # Logs
    access_log /var/log/nginx/gkg-heatmap_access.log;
    error_log /var/log/nginx/gkg-heatmap_error.log;
}
```

### 3. Set File Permissions

```bash
# Make PERL scripts executable
chmod +x /var/www/gkg-heatmap/cgi-bin/*.pl

# Create data directories
mkdir -p /var/www/gkg-heatmap/data/{results,temp,logs}

# Set permissions for data directories
chmod 755 /var/www/gkg-heatmap/data
chmod 777 /var/www/gkg-heatmap/data/results
chmod 777 /var/www/gkg-heatmap/data/temp  
chmod 777 /var/www/gkg-heatmap/data/logs

# Set proper ownership
chown -R www-data:www-data /var/www/gkg-heatmap/data
```

### 4. Configure Email Settings

Edit `/var/www/gkg-heatmap/cgi-bin/gkg_processor.pl`:

```perl
# Email configuration (modify these settings)
my $SMTP_SERVER = 'localhost';         # Your SMTP server
my $SMTP_PORT = 587;                   # SMTP port
my $SMTP_USERNAME = 'your_email@domain.com';  # SMTP username
my $SMTP_PASSWORD = 'your_password';   # SMTP password
my $FROM_EMAIL = 'gkg-heatmap@yourdomain.com'; # From address
```

### 5. Set Up Google Maps API (Optional)

1. Get a Google Maps JavaScript API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API (if using location geocoding)

3. Update the API key in generated heatmap HTML files by modifying the `generate_heatmap_html_template` function in `gkg_processor.pl`:

```perl
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY"></script>
```

### 6. Test Installation

#### Test Web Interface
1. Open your browser and navigate to `http://gkg-heatmap.yourdomain.com/`
2. Verify the form loads correctly
3. Check that CSS and JavaScript files load without errors

#### Test PERL Backend
```bash
# Test PERL script directly
cd /var/www/gkg-heatmap/cgi-bin
perl -c gkg_processor.pl

# Should output: "gkg_processor.pl syntax OK"
```

#### Test CGI Functionality
Create a test file `/var/www/gkg-heatmap/cgi-bin/test.pl`:

```perl
#!/usr/bin/perl -w
use strict;
use CGI;

my $cgi = CGI->new;
print $cgi->header(-type => 'text/plain');
print "CGI is working!\n";
print "Current time: " . scalar(localtime) . "\n";
```

Make it executable and test:
```bash
chmod +x /var/www/gkg-heatmap/cgi-bin/test.pl
curl http://gkg-heatmap.yourdomain.com/cgi-bin/test.pl
```

### 7. Configure Log Rotation

Create `/etc/logrotate.d/gkg-heatmap`:

```
/var/www/gkg-heatmap/data/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    notifempty
    create 644 www-data www-data
    postrotate
        /bin/systemctl reload apache2 > /dev/null 2>&1 || true
    endscript
}
```

## Configuration Options

### Environment Variables

Set in your system environment or PERL script:

```bash
export GKG_GDELT_API_URL="http://data.gdeltproject.org/gdeltv2"
export GKG_MAX_PROCESSING_TIME=1800  # 30 minutes
export GKG_EMAIL_TIMEOUT=300         # 5 minutes
export GKG_TEMP_RETENTION_DAYS=7     # Keep temp files for 7 days
```

### Performance Tuning

#### For High Traffic
```perl
# In gkg_processor.pl, adjust these values:
my $MAX_CONCURRENT_REQUESTS = 10;
my $REQUEST_TIMEOUT = 1800;  # 30 minutes
my $CLEANUP_INTERVAL = 3600; # 1 hour
```

#### Memory Optimization
```perl
# Limit result set size
my $MAX_LOCATIONS = 1000;
my $MAX_RECORDS_PROCESSED = 100000;
```

## Troubleshooting

### Common Issues

#### 1. CGI Scripts Not Executing
```bash
# Check Apache error log
tail -f /var/log/apache2/error.log

# Common solutions:
sudo a2enmod cgi
sudo systemctl restart apache2
chmod +x /var/www/gkg-heatmap/cgi-bin/*.pl
```

#### 2. Permission Denied Errors
```bash
# Fix ownership and permissions
sudo chown -R www-data:www-data /var/www/gkg-heatmap
sudo chmod -R 755 /var/www/gkg-heatmap
sudo chmod 777 /var/www/gkg-heatmap/data/*/
```

#### 3. PERL Module Missing
```bash
# Install missing modules
cpan install Module::Name

# Or using system package manager (Ubuntu/Debian):
sudo apt-get install libcgi-pm-perl
sudo apt-get install libjson-perl
sudo apt-get install libmime-lite-perl
```

#### 4. Email Not Sending
- Verify SMTP settings in `gkg_processor.pl`
- Check firewall rules for SMTP ports
- Test email functionality separately
- Check system mail logs: `tail -f /var/log/mail.log`

#### 5. Google Maps Not Loading
- Verify API key is correct and active
- Check browser console for JavaScript errors
- Ensure API key has proper domain restrictions

### Debugging Tips

#### Enable Debug Mode
Add to the beginning of `gkg_processor.pl`:
```perl
use CGI::Carp qw(warningsToBrowser fatalsToBrowser);
$| = 1; # Enable autoflush
```

#### Check System Resources
```bash
# Monitor during processing
htop
df -h
tail -f /var/www/gkg-heatmap/data/logs/gkg_processor.log
```

### Log File Locations

- **Apache Errors**: `/var/log/apache2/error.log`
- **Application Logs**: `/var/www/gkg-heatmap/data/logs/gkg_processor.log`
- **System Mail**: `/var/log/mail.log` (Ubuntu/Debian)

## Security Considerations

### File Permissions
```bash
# Secure sensitive files
chmod 600 /var/www/gkg-heatmap/cgi-bin/config.pl
chmod 644 /var/www/gkg-heatmap/*.html
chmod 755 /var/www/gkg-heatmap/cgi-bin/*.pl
```

### Input Validation
- Form inputs are validated client-side and server-side
- Email addresses are validated with regex
- Date ranges are checked against allowed minimums/maximums
- Keywords are sanitized to prevent injection attacks

### Rate Limiting
Consider implementing rate limiting to prevent abuse:
```bash
# Using fail2ban or similar tools
# Monitor for excessive requests from single IPs
```

## Maintenance Tasks

### Regular Maintenance
```bash
# Clean old temporary files (run daily via cron)
find /var/www/gkg-heatmap/data/temp -type f -mtime +7 -delete

# Clean old result files (run weekly)
find /var/www/gkg-heatmap/data/results -type f -mtime +30 -delete

# Update GDELT data cache if implemented
# /usr/local/bin/update-gdelt-cache.sh
```

### Monitoring
Set up monitoring for:
- Disk space usage in data directories
- Processing queue length
- Error rates in logs
- Email delivery success rates

## Support

For installation support:
1. Check the troubleshooting section above
2. Review server error logs for specific error messages  
3. Verify all dependencies are installed correctly
4. Test each component individually before full integration

Contact your system administrator or the development team with specific error messages and log entries for additional assistance.