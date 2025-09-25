# GKG Heatmap Visualizer - API Documentation

This document describes the API endpoints and data formats used by the GKG Heatmap Visualizer system.

## Overview

The GKG Heatmap Visualizer provides a RESTful API for programmatic access to heatmap generation functionality. The system processes requests asynchronously and delivers results via email.

## Base URL

```
http://your-domain.com/gkg-heatmap/
```

## Authentication

Currently, the API does not require authentication. Rate limiting may be implemented to prevent abuse.

## Endpoints

### 1. Submit Heatmap Request

Submit a new heatmap generation request.

**Endpoint:** `POST /cgi-bin/gkg_processor.pl`

**Content-Type:** `application/x-www-form-urlencoded`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | Email address for result delivery |
| `startDate` | string | Yes | Start date (YYYY-MM-DD format, min: 2013-04-01) |
| `endDate` | string | Yes | End date (YYYY-MM-DD format, max: current date) |
| `includeAll` | string | No | Keywords that must ALL be present (comma-separated) |
| `includeAny` | string | No | Keywords where at least ONE must be present (comma-separated) |
| `exclude` | string | No | Keywords that must NOT be present (comma-separated) |
| `weighting` | string | No | Weighting method: `namesets` (default) or `articles` |

**Note:** Either `includeAll` or `includeAny` must be provided.

#### Example Request

```bash
curl -X POST "http://your-domain.com/gkg-heatmap/cgi-bin/gkg_processor.pl" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "email=user@example.com" \
     -d "startDate=2024-01-01" \
     -d "endDate=2024-01-31" \
     -d "includeAll=Nigeria" \
     -d "includeAny=WATER_SECURITY,FOOD_SECURITY" \
     -d "exclude=Barack Obama,Edward Snowden" \
     -d "weighting=namesets"
```

#### Success Response

**Status:** `200 OK`

```json
{
  "status": "success",
  "message": "Request submitted successfully",
  "request_id": "1640995200_A1B2C3D4",
  "email": "user@example.com",
  "estimated_completion": "10 minutes"
}
```

#### Error Response

**Status:** `200 OK` (errors are returned in JSON format)

```json
{
  "status": "error",
  "message": "Invalid email format",
  "request_id": "1640995200_A1B2C3D4"
}
```

## Request Validation

### Email Validation
- Must be a valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Required field

### Date Validation
- **Format**: YYYY-MM-DD
- **Start Date**: Must be on or after 2013-04-01 (GKG data availability)
- **End Date**: Cannot be in the future
- **Logical**: Start date must be before or equal to end date
- Both dates are required

### Search Criteria Validation
- At least one of `includeAll` or `includeAny` must be provided
- Keywords are case-insensitive
- Multiple keywords separated by commas
- Keywords are trimmed of whitespace

### Weighting Validation
- Must be either `namesets` or `articles`
- Defaults to `namesets` if not specified

## Response Data Formats

### Request ID Format
Request IDs follow the format: `{timestamp}_{random_hex}`

Example: `1640995200_A1B2C3D4`

### Email Delivery

Results are delivered via email containing:

1. **Interactive Heatmap** (HTML file attachment)
2. **CSV Data File** (CSV file attachment)
3. **Processing Summary** (in email body)

#### Email Content Structure

```
Subject: GKG Heatmap Results - Request {request_id}

Dear User,

Your GKG heatmap visualization is ready!

Request Details:
- Request ID: {request_id}
- Search Criteria: {criteria_summary}
- Date Range: {start_date} to {end_date}
- Weighting Method: {weighting}

Results Summary:
- Total Locations Found: {location_count}
- Total Records Processed: {record_count}
- Average Tone: {average_tone}

Please find your results attached:
1. interactive_heatmap.html - Open in web browser
2. location_data.csv - Import into GIS software

Attachments: 2 files
```

## Data Formats

### CSV Output Format

The CSV file contains the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `Latitude` | float | Decimal degrees (-90 to 90) |
| `Longitude` | float | Decimal degrees (-180 to 180) |
| `Location` | string | Place name or geographic identifier |
| `Count` | integer | Number of records/articles (based on weighting) |
| `Average_Tone` | float | Average sentiment score (-100 to +100) |

#### Example CSV Content

```csv
Latitude,Longitude,Location,Count,Average_Tone
40.712800,-74.006000,New York City,245,12.50
51.507400,-0.127800,London,198,-5.20
35.676200,139.650300,Tokyo,167,8.10
```

### Interactive Heatmap HTML

The HTML file contains:
- Self-contained heatmap visualization
- Google Maps integration
- heatmap.js library
- Interactive controls (intensity, radius, opacity)
- Location data embedded as JavaScript

## Error Codes and Messages

### Validation Errors

| Error Message | Cause | Solution |
|---------------|--------|----------|
| `Email address is required` | Missing email parameter | Provide valid email address |
| `Invalid email format` | Malformed email address | Use format: user@domain.com |
| `Start date is required` | Missing startDate parameter | Provide date in YYYY-MM-DD format |
| `End date is required` | Missing endDate parameter | Provide date in YYYY-MM-DD format |
| `Invalid start date format` | Malformed start date | Use YYYY-MM-DD format |
| `Invalid end date format` | Malformed end date | Use YYYY-MM-DD format |
| `Start date must be on or after April 1, 2013` | Date before GKG data availability | Use date >= 2013-04-01 |
| `End date must be on or after April 1, 2013` | Date before GKG data availability | Use date >= 2013-04-01 |
| `Start date must be before or equal to end date` | Logical date error | Ensure start <= end |
| `You must specify at least one search criterion` | No search criteria provided | Provide includeAll or includeAny |
| `Invalid weighting option` | Invalid weighting parameter | Use 'namesets' or 'articles' |

### Processing Errors

| Error Message | Cause | Typical Resolution |
|---------------|--------|-------------------|
| `Failed to fork process` | System resource limitation | Retry later or contact admin |
| `GDELT data unavailable` | External API issue | Retry with different date range |
| `Processing timeout` | Request too complex | Reduce date range or keywords |
| `Email delivery failed` | SMTP configuration issue | Contact administrator |

## Rate Limiting

Currently, rate limiting is not implemented but may be added in future versions. Recommended usage patterns:

- **Maximum concurrent requests per IP**: 5
- **Maximum requests per hour per IP**: 50
- **Maximum requests per day per IP**: 200

## Best Practices

### Request Optimization

1. **Use specific date ranges** - Smaller ranges process faster
2. **Be selective with keywords** - Too many keywords can slow processing
3. **Choose appropriate weighting** - Namesets for trends, articles for events

### Error Handling

```javascript
// Example JavaScript error handling
fetch('/cgi-bin/gkg_processor.pl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData)
})
.then(response => response.json())
.then(data => {
    if (data.status === 'success') {
        console.log('Request submitted:', data.request_id);
        // Show success message to user
    } else {
        console.error('Request failed:', data.message);
        // Show error message to user
    }
})
.catch(error => {
    console.error('Network error:', error);
    // Handle network/server errors
});
```

### Monitoring Request Status

Since processing is asynchronous, monitor for:
1. **Immediate response** - Confirms request submission
2. **Email delivery** - Contains actual results
3. **Processing time** - Typically 2-10 minutes

## Integration Examples

### Python Example

```python
import requests
import json

def submit_heatmap_request(email, start_date, end_date, keywords):
    url = "http://your-domain.com/gkg-heatmap/cgi-bin/gkg_processor.pl"
    
    data = {
        'email': email,
        'startDate': start_date,
        'endDate': end_date,
        'includeAny': ','.join(keywords),
        'weighting': 'namesets'
    }
    
    response = requests.post(url, data=data)
    result = response.json()
    
    if result['status'] == 'success':
        print(f"Request submitted: {result['request_id']}")
        return result['request_id']
    else:
        raise Exception(f"Request failed: {result['message']}")

# Usage
try:
    request_id = submit_heatmap_request(
        email="analyst@company.com",
        start_date="2024-01-01", 
        end_date="2024-01-31",
        keywords=["CLIMATE_CHANGE", "GLOBAL_WARMING"]
    )
    print(f"Check email for results with ID: {request_id}")
except Exception as e:
    print(f"Error: {e}")
```

### JavaScript Example

```javascript
class GKGHeatmapAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    async submitRequest(params) {
        const formData = new URLSearchParams();
        Object.keys(params).forEach(key => {
            formData.append(key, params[key]);
        });
        
        try {
            const response = await fetch(`${this.baseUrl}/cgi-bin/gkg_processor.pl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                return result;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            throw new Error(`Network error: ${error.message}`);
        }
    }
}

// Usage
const api = new GKGHeatmapAPI('http://your-domain.com/gkg-heatmap');

api.submitRequest({
    email: 'researcher@university.edu',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    includeAll: 'Nigeria',
    includeAny: 'WATER_SECURITY,FOOD_SECURITY',
    weighting: 'namesets'
}).then(result => {
    console.log('Success:', result.request_id);
}).catch(error => {
    console.error('Error:', error.message);
});
```

## Changelog

### Version 1.0
- Initial API implementation
- Basic request/response handling
- Email-based result delivery
- CSV and HTML output formats

## Support

For API support and questions:
- Review error messages carefully for specific guidance
- Check server logs for detailed error information
- Verify all required parameters are included
- Contact system administrator for server-side issues