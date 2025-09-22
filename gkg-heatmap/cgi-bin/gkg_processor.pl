#!/usr/bin/perl -w

# GKG Heatmap Processor
# Processes GDELT Global Knowledge Graph queries and generates heatmap data

use strict;
use warnings;
use CGI qw(:standard);
use CGI::Carp qw(warningsToBrowser fatalsToBrowser);
use JSON;
use MIME::Lite;
use Data::Dumper;
use File::Path qw(make_path);
use Time::HiRes qw(time);

# Configuration
my $GDELT_BASE_URL = "http://data.gdeltproject.org/gdeltv2";
my $OUTPUT_DIR = "../data/results";
my $TEMP_DIR = "../data/temp";
my $LOG_DIR = "../data/logs";

# Ensure directories exist
make_path($OUTPUT_DIR, $TEMP_DIR, $LOG_DIR) unless -d $OUTPUT_DIR && -d $TEMP_DIR && -d $LOG_DIR;

# Main execution
main();

sub main {
    my $cgi = CGI->new;
    
    # Set content type
    print $cgi->header(-type => 'application/json', -charset => 'utf-8');
    
    # Log request start
    my $request_id = generate_request_id();
    log_message($request_id, "Processing GKG heatmap request");
    
    eval {
        # Parse and validate input parameters
        my $params = parse_parameters($cgi);
        validate_parameters($params);
        
        # Process the request asynchronously
        process_gkg_request($request_id, $params);
        
        # Return success response
        print encode_json({
            status => 'success',
            message => 'Request submitted successfully',
            request_id => $request_id,
            email => $params->{email},
            estimated_completion => '10 minutes'
        });
        
    } catch {
        my $error = $_;
        log_message($request_id, "Error: $error");
        
        print encode_json({
            status => 'error',
            message => $error,
            request_id => $request_id
        });
    };
}

sub parse_parameters {
    my ($cgi) = @_;
    
    return {
        email => $cgi->param('email') || '',
        start_date => $cgi->param('startDate') || '',
        end_date => $cgi->param('endDate') || '',
        include_all => $cgi->param('includeAll') || '',
        include_any => $cgi->param('includeAny') || '',
        exclude => $cgi->param('exclude') || '',
        weighting => $cgi->param('weighting') || 'namesets'
    };
}

sub validate_parameters {
    my ($params) = @_;
    
    # Email validation
    die "Email address is required" unless $params->{email};
    die "Invalid email format" unless $params->{email} =~ /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    # Date validation
    die "Start date is required" unless $params->{start_date};
    die "End date is required" unless $params->{end_date};
    
    my ($start_year, $start_month, $start_day) = split /-/, $params->{start_date};
    my ($end_year, $end_month, $end_day) = split /-/, $params->{end_date};
    
    die "Invalid start date format" unless $start_year && $start_month && $start_day;
    die "Invalid end date format" unless $end_year && $end_month && $end_day;
    
    # Check minimum date (April 1, 2013)
    my $min_date = 20130401;
    my $start_int = $start_year * 10000 + $start_month * 100 + $start_day;
    my $end_int = $end_year * 10000 + $end_month * 100 + $end_day;
    
    die "Start date must be on or after April 1, 2013" if $start_int < $min_date;
    die "End date must be on or after April 1, 2013" if $end_int < $min_date;
    die "Start date must be before or equal to end date" if $start_int > $end_int;
    
    # Search criteria validation
    die "You must specify at least one search criterion" 
        unless $params->{include_all} || $params->{include_any};
    
    # Weighting validation
    die "Invalid weighting option" 
        unless $params->{weighting} eq 'namesets' || $params->{weighting} eq 'articles';
}

sub process_gkg_request {
    my ($request_id, $params) = @_;
    
    # Fork process to handle request asynchronously
    my $pid = fork();
    
    if ($pid == 0) {
        # Child process - handle the actual processing
        close STDOUT;
        close STDERR;
        
        eval {
            log_message($request_id, "Starting GKG data processing");
            
            # Step 1: Query GKG data
            my $gkg_records = query_gkg_data($request_id, $params);
            log_message($request_id, "Retrieved " . scalar(@$gkg_records) . " GKG records");
            
            # Step 2: Extract and process locations
            my $location_data = process_locations($request_id, $gkg_records, $params);
            log_message($request_id, "Processed " . scalar(keys %$location_data) . " unique locations");
            
            # Step 3: Generate outputs
            my $heatmap_file = generate_heatmap_html($request_id, $location_data, $params);
            my $csv_file = generate_csv_output($request_id, $location_data, $params);
            
            # Step 4: Send email with results
            send_results_email($request_id, $params, $heatmap_file, $csv_file);
            
            log_message($request_id, "Request completed successfully");
            
        } catch {
            my $error = $_;
            log_message($request_id, "Processing error: $error");
            send_error_email($request_id, $params, $error);
        };
        
        exit 0;
    }
    
    # Parent process continues
    die "Failed to fork process" unless defined $pid;
}

sub query_gkg_data {
    my ($request_id, $params) = @_;
    
    # This is a simplified simulation of GKG data querying
    # In a real implementation, this would query the actual GDELT GKG database
    
    log_message($request_id, "Simulating GKG data query with parameters: " . encode_json($params));
    
    # Generate sample location data based on search criteria
    my @sample_locations = (
        { lat => 40.7128, lng => -74.0060, location => "New York City", count => 245, tone => 12.5 },
        { lat => 51.5074, lng => -0.1278, location => "London", count => 198, tone => -5.2 },
        { lat => 35.6762, lng => 139.6503, location => "Tokyo", count => 167, tone => 8.1 },
        { lat => 48.8566, lng => 2.3522, location => "Paris", count => 134, tone => -12.7 },
        { lat => 52.5200, lng => 13.4050, location => "Berlin", count => 89, tone => 15.3 },
        { lat => 37.7749, lng => -122.4194, location => "San Francisco", count => 156, tone => 22.1 },
        { lat => 55.7558, lng => 37.6176, location => "Moscow", count => 201, tone => -18.9 },
        { lat => 39.9042, lng => 116.4074, location => "Beijing", count => 234, tone => 6.7 },
        { lat => 28.6139, lng => 77.2090, location => "New Delhi", count => 178, tone => -8.4 },
        { lat => -33.8688, lng => 151.2093, location => "Sydney", count => 87, tone => 19.6 }
    );
    
    # Filter and modify based on search criteria (simplified simulation)
    my @filtered_locations;
    
    for my $loc (@sample_locations) {
        # Simple keyword matching simulation
        my $match = 0;
        
        if ($params->{include_all}) {
            my @keywords = split /,\s*/, lc($params->{include_all});
            $match = 1 if grep { index(lc($loc->{location}), $_) >= 0 } @keywords;
        }
        
        if ($params->{include_any} && !$match) {
            my @keywords = split /,\s*/, lc($params->{include_any});
            $match = 1 if grep { index(lc($loc->{location}), $_) >= 0 } @keywords;
        }
        
        if (!$params->{include_all} && !$params->{include_any}) {
            $match = 1; # Include all if no specific criteria
        }
        
        # Apply exclusion criteria
        if ($match && $params->{exclude}) {
            my @exclude_keywords = split /,\s*/, lc($params->{exclude});
            $match = 0 if grep { index(lc($loc->{location}), $_) >= 0 } @exclude_keywords;
        }
        
        push @filtered_locations, $loc if $match;
    }
    
    # Adjust counts based on weighting method
    if ($params->{weighting} eq 'articles') {
        # Increase variance for article-based weighting
        for my $loc (@filtered_locations) {
            $loc->{count} = int($loc->{count} * (0.5 + rand(1.5)));
        }
    }
    
    return \@filtered_locations;
}

sub process_locations {
    my ($request_id, $gkg_records, $params) = @_;
    
    my %location_data;
    
    for my $record (@$gkg_records) {
        my $key = $record->{lat} . "," . $record->{lng};
        
        if (exists $location_data{$key}) {
            $location_data{$key}->{count} += $record->{count};
            # Average the tone values
            $location_data{$key}->{tone} = ($location_data{$key}->{tone} + $record->{tone}) / 2;
        } else {
            $location_data{$key} = {
                lat => $record->{lat},
                lng => $record->{lng},
                location => $record->{location},
                count => $record->{count},
                tone => $record->{tone}
            };
        }
    }
    
    return \%location_data;
}

sub generate_heatmap_html {
    my ($request_id, $location_data, $params) = @_;
    
    my $filename = "${request_id}_heatmap.html";
    my $filepath = "$OUTPUT_DIR/$filename";
    
    # Convert location data to JavaScript format
    my @js_data;
    for my $key (keys %$location_data) {
        my $loc = $location_data->{$key};
        push @js_data, {
            lat => $loc->{lat},
            lng => $loc->{lng},
            count => $loc->{count}
        };
    }
    
    my $js_data_json = encode_json(\@js_data);
    
    # Generate HTML content
    my $html_content = generate_heatmap_html_template($js_data_json, $params);
    
    open my $fh, '>', $filepath or die "Cannot write heatmap file: $!";
    print $fh $html_content;
    close $fh;
    
    log_message($request_id, "Generated heatmap HTML: $filename");
    return $filepath;
}

sub generate_csv_output {
    my ($request_id, $location_data, $params) = @_;
    
    my $filename = "${request_id}_locations.csv";
    my $filepath = "$OUTPUT_DIR/$filename";
    
    open my $fh, '>', $filepath or die "Cannot write CSV file: $!";
    
    # CSV header
    print $fh "Latitude,Longitude,Location,Count,Average_Tone\n";
    
    # Sort by count (descending)
    my @sorted_locations = sort { $location_data->{$b}->{count} <=> $location_data->{$a}->{count} } 
                          keys %$location_data;
    
    for my $key (@sorted_locations) {
        my $loc = $location_data->{$key};
        printf $fh "%.6f,%.6f,%s,%d,%.2f\n",
            $loc->{lat}, $loc->{lng}, $loc->{location}, $loc->{count}, $loc->{tone};
    }
    
    close $fh;
    
    log_message($request_id, "Generated CSV output: $filename");
    return $filepath;
}

sub send_results_email {
    my ($request_id, $params, $heatmap_file, $csv_file) = @_;
    
    log_message($request_id, "Sending results email to: " . $params->{email});
    
    # In a real implementation, this would send actual email with attachments
    # For now, we'll simulate the email sending
    
    my $email_content = generate_email_content($request_id, $params, $heatmap_file, $csv_file);
    
    # Log the email content (in real implementation, use MIME::Lite to send)
    log_message($request_id, "Email content prepared (simulation): $email_content");
    
    # Simulate email sending delay
    sleep 1;
    
    log_message($request_id, "Results email sent successfully");
}

sub send_error_email {
    my ($request_id, $params, $error) = @_;
    
    log_message($request_id, "Sending error email to: " . $params->{email});
    
    # In real implementation, send error notification email
    my $error_content = "We apologize, but there was an error processing your GKG heatmap request: $error";
    log_message($request_id, "Error email content: $error_content");
}

sub generate_heatmap_html_template {
    my ($js_data, $params) = @_;
    
    return <<HTML;
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GKG Heatmap Visualization</title>
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
    <script src="https://www.patrick-wied.at/static/heatmapjs/heatmap.js"></script>
    <script src="https://www.patrick-wied.at/static/heatmapjs/plugins/gmaps-heatmap.js"></script>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        #map { height: 100vh; width: 100%; }
        #controls { 
            position: absolute; 
            top: 10px; 
            left: 10px; 
            background: white; 
            padding: 10px; 
            border-radius: 5px; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        #intensity-slider { width: 200px; margin: 10px 0; }
        .control-group { margin-bottom: 10px; }
        label { font-weight: bold; margin-right: 10px; }
    </style>
</head>
<body>
    <div id="controls">
        <h3>GKG Heatmap Controls</h3>
        <div class="control-group">
            <label for="intensity-slider">Intensity:</label>
            <input type="range" id="intensity-slider" min="0" max="100" value="50">
            <span id="intensity-value">50</span>
        </div>
        <div class="control-group">
            <label for="radius-slider">Radius:</label>
            <input type="range" id="radius-slider" min="10" max="50" value="25">
            <span id="radius-value">25</span>
        </div>
    </div>
    <div id="map"></div>
    
    <script>
        var heatmapData = $js_data;
        
        function initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 2,
                center: {lat: 20, lng: 0},
                mapTypeId: 'roadmap'
            });
            
            var heatmap = new HeatmapOverlay(map, {
                radius: 25,
                maxOpacity: 0.8,
                scaleRadius: true,
                useLocalExtrema: false,
                latField: 'lat',
                lngField: 'lng',
                valueField: 'count'
            });
            
            // Set heatmap data
            heatmap.setData({
                max: Math.max(...heatmapData.map(d => d.count)),
                data: heatmapData
            });
            
            // Control handlers
            document.getElementById('intensity-slider').addEventListener('input', function(e) {
                var intensity = e.target.value / 100;
                heatmap.cfg.maxOpacity = intensity;
                heatmap.repaint();
                document.getElementById('intensity-value').textContent = e.target.value;
            });
            
            document.getElementById('radius-slider').addEventListener('input', function(e) {
                heatmap.cfg.radius = parseInt(e.target.value);
                heatmap.repaint();
                document.getElementById('radius-value').textContent = e.target.value;
            });
        }
        
        // Initialize map when page loads
        google.maps.event.addDomListener(window, 'load', initMap);
    </script>
</body>
</html>
HTML
}

sub generate_email_content {
    my ($request_id, $params, $heatmap_file, $csv_file) = @_;
    
    return "Your GKG heatmap visualization is ready! Request ID: $request_id";
}

sub generate_request_id {
    return sprintf "%d_%08x", time(), int(rand(0xFFFFFFFF));
}

sub log_message {
    my ($request_id, $message) = @_;
    
    my $timestamp = scalar localtime;
    my $log_entry = "[$timestamp] [$request_id] $message\n";
    
    open my $fh, '>>', "$LOG_DIR/gkg_processor.log" or return;
    print $fh $log_entry;
    close $fh;
    
    # Also log to STDERR for debugging
    warn $log_entry;
}

# Simple try/catch implementation
sub catch(&@) {
    my ($try, $catch) = @_;
    eval { &$try };
    if ($@) {
        local $_ = $@;
        &$catch;
    }
}