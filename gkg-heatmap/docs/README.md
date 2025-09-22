# GKG Heatmap Visualizer

The GKG Heatmap Visualizer is a web-based application that creates interactive geographic heatmaps from the GDELT Global Knowledge Graph (GKG) to understand spatial patterns in news coverage and media attention.

## Overview

This system allows users to rapidly construct geographic heatmaps from GKG data by:

1. **Specifying search criteria** - Person/organization names, locations, or GKG themes
2. **Setting date ranges** - From April 1, 2013 to the current date
3. **Choosing location weighting** - Either by namesets or article counts
4. **Receiving results via email** - Interactive heatmap and CSV data file

## Features

### Interactive Web Interface
- User-friendly form for specifying search parameters
- Real-time validation and helpful error messages
- Responsive design that works on desktop and mobile devices

### Powerful Search Capabilities
- **Include ALL OF**: Records must contain all specified keywords
- **Include AT LEAST ONE OF**: Records must contain at least one keyword
- **Must NOT Have ANY OF**: Exclude records with specified keywords
- Boolean AND logic between field groups

### Two Weighting Methods
1. **Number Namesets**: Weights by diversity of contexts (recommended for broad trends)
2. **Number Articles**: Weights by raw frequency (better for short-term focus)

### Dual Output Formats
1. **Interactive Heatmap**: Browser-based visualization with adjustable controls
2. **CSV Data**: For import into GIS software with location coordinates, counts, and tone data

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   PERL Backend  │    │  GDELT GKG API  │
│  (HTML/CSS/JS)  │───▶│  (Processing)   │───▶│    (Data)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │  Email Service  │
         │              │  (Results)      │
         └──────────────▶└─────────────────┘
```

## File Structure

```
gkg-heatmap/
├── index.html              # Main web interface
├── sample-heatmap.html     # Demo heatmap visualization
├── sample-locations.csv    # Sample CSV output
├── css/
│   └── styles.css          # Interface styling
├── js/
│   └── form-validation.js  # Form validation and enhancement
├── cgi-bin/
│   └── gkg_processor.pl    # PERL backend processor
└── docs/
    ├── README.md           # This documentation
    ├── API.md              # API documentation
    └── INSTALL.md          # Installation guide
```

## Usage Instructions

### 1. Access the Interface
Open `index.html` in a web browser or deploy to a web server.

### 2. Fill Out the Form

#### Email Address (Required)
Enter the email address where results should be sent. Processing typically takes 10 minutes.

#### Date Range (Required)
- **Start Date**: Earliest date for analysis (minimum: April 1, 2013)
- **End Date**: Latest date for analysis (maximum: current date)

#### Search Criteria (At least one required)
- **Include ALL OF**: Enter keywords separated by commas. Records must contain ALL of these terms.
- **Include AT LEAST ONE OF**: Records must contain at least ONE of these terms.
- **Must NOT Have ANY OF**: Exclude records containing ANY of these terms.

*Example: To find coverage of water/food security in Nigeria excluding Obama/Snowden mentions:*
- Include ALL OF: `Nigeria`
- Include AT LEAST ONE OF: `WATER_SECURITY, FOOD_SECURITY`
- Must NOT Have ANY OF: `Barack Obama, Edward Snowden`

#### Location Weighting
- **Number Namesets**: More stable, focuses on diverse contexts
- **Number Articles**: More sensitive to breaking news, shows frequency

### 3. Submit and Wait
Click "Generate Heatmap" and wait for email delivery of results.

## Output Files

### Interactive Heatmap (HTML)
- Displays on Google Maps overlay using heatmap.js
- Interactive controls for intensity, radius, and opacity
- Zoom and pan functionality
- Works in any modern web browser

### CSV Data File
Contains columns:
- **Latitude**: Decimal degrees
- **Longitude**: Decimal degrees  
- **Location**: Place name
- **Count**: Number of records/articles (based on weighting choice)
- **Average_Tone**: Sentiment score (-100 to +100)

## Technical Requirements

### Server Requirements
- **Web Server**: Apache, Nginx, or similar with CGI support
- **PERL**: Version 5.10 or higher
- **PERL Modules**: CGI, JSON, MIME::Lite, Data::Dumper, File::Path, Time::HiRes

### Client Requirements
- **Browser**: Modern web browser with JavaScript enabled
- **Internet**: Connection required for Google Maps API and heatmap.js library

### Optional Enhancements
- **Email Server**: SMTP configuration for result delivery
- **Database**: For caching and performance optimization
- **API Keys**: Google Maps API key for enhanced mapping features

## Data Sources

This system processes data from the **GDELT Global Knowledge Graph (GKG)**, which provides:

- **Coverage Period**: April 1, 2013 to present
- **Update Frequency**: Near real-time (15-minute intervals)
- **Global Scope**: Worldwide news coverage in 65+ languages
- **Rich Metadata**: Locations, people, organizations, themes, and sentiment

## Acknowledgments

This project makes use of several open-source libraries and data sources:

- **heatmap.js**: JavaScript heatmap visualization library by Patrick Wied
- **Google Maps API**: Interactive mapping platform
- **GDELT Project**: Global database of events, language, and tone
- **Global Knowledge Graph**: Structured data from news articles worldwide

## Support and Troubleshooting

### Common Issues

1. **Email not received**: Check spam folder, verify email address format
2. **No search results**: Try broader keywords or different date range
3. **Slow processing**: Server load can affect processing time (usually <10 minutes)
4. **Display issues**: Ensure browser supports modern JavaScript and CSS

### Error Messages

- **"Invalid email format"**: Use proper email format (user@domain.com)
- **"Date must be after April 1, 2013"**: GKG data starts from this date
- **"Must specify search criteria"**: At least one search field is required
- **"Start date after end date"**: Check date order

### Getting Help

For technical support or feature requests:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify all system requirements are met
4. Contact system administrator with specific error details

## Version History

- **v1.0** (Current): Initial implementation with core functionality
  - Web interface with form validation
  - PERL backend processing
  - Email delivery system
  - Sample visualizations and data

## License

This project is released under the MIT License. See LICENSE file for details.

Components used under their respective licenses:
- heatmap.js: MIT License
- Google Maps API: Google Terms of Service
- GDELT data: Creative Commons Attribution 4.0 International License