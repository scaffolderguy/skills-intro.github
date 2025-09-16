/**
 * Context Capture System - Advanced environmental and situational context collection
 * 
 * This system captures rich contextual information about the environment,
 * system state, and external factors that influence user experiences.
 */

class ContextCapture {
    constructor(config = {}) {
        this.enabledSensors = config.enabledSensors || [
            'system', 'network', 'temporal', 'user', 'application'
        ];
        this.samplingInterval = config.samplingInterval || 1000; // ms
        this.retentionPeriod = config.retentionPeriod || 24 * 60 * 60 * 1000; // 24 hours
        this.contextHistory = [];
        this.activeMonitoring = false;
        
        // Initialize sensor modules
        this.sensors = {
            system: new SystemSensor(),
            network: new NetworkSensor(),
            temporal: new TemporalSensor(),
            user: new UserSensor(),
            application: new ApplicationSensor()
        };
    }

    /**
     * Capture comprehensive context snapshot
     */
    capture(baseContext = {}) {
        const timestamp = new Date().toISOString();
        const context = {
            timestamp,
            ...baseContext
        };

        // Capture from each enabled sensor
        this.enabledSensors.forEach(sensorType => {
            if (this.sensors[sensorType]) {
                try {
                    const sensorData = this.sensors[sensorType].capture();
                    context[sensorType] = sensorData;
                } catch (error) {
                    console.warn(`Failed to capture ${sensorType} context:`, error.message);
                    context[sensorType] = { error: error.message };
                }
            }
        });

        // Add to history if monitoring is active
        if (this.activeMonitoring) {
            this.contextHistory.push(context);
            this.cleanupHistory();
        }

        return context;
    }

    /**
     * Start continuous context monitoring
     */
    startMonitoring() {
        if (this.activeMonitoring) return;

        this.activeMonitoring = true;
        this.monitoringInterval = setInterval(() => {
            this.capture();
        }, this.samplingInterval);
    }

    /**
     * Stop continuous context monitoring
     */
    stopMonitoring() {
        if (!this.activeMonitoring) return;

        this.activeMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }

    /**
     * Clean up old context history
     */
    cleanupHistory() {
        const cutoff = Date.now() - this.retentionPeriod;
        this.contextHistory = this.contextHistory.filter(entry => 
            new Date(entry.timestamp).getTime() > cutoff
        );
    }

    /**
     * Get context trends over time
     */
    getContextTrends(duration = 3600000) { // 1 hour default
        const since = new Date(Date.now() - duration);
        const relevantHistory = this.contextHistory.filter(entry => 
            new Date(entry.timestamp) > since
        );

        return {
            system_trends: this.analyzeSystemTrends(relevantHistory),
            network_trends: this.analyzeNetworkTrends(relevantHistory),
            usage_patterns: this.analyzeUsagePatterns(relevantHistory),
            correlation_insights: this.findCorrelations(relevantHistory)
        };
    }

    /**
     * Analyze system performance trends
     */
    analyzeSystemTrends(history) {
        if (history.length === 0) return null;

        const systemData = history.map(entry => entry.system).filter(Boolean);
        
        return {
            cpu_trend: this.calculateTrend(systemData.map(s => s.cpu_usage)),
            memory_trend: this.calculateTrend(systemData.map(s => s.memory_usage)),
            performance_stability: this.calculateStability(systemData),
            resource_pressure: this.assessResourcePressure(systemData)
        };
    }

    /**
     * Analyze network performance trends
     */
    analyzeNetworkTrends(history) {
        if (history.length === 0) return null;

        const networkData = history.map(entry => entry.network).filter(Boolean);
        
        return {
            latency_trend: this.calculateTrend(networkData.map(n => n.latency)),
            bandwidth_trend: this.calculateTrend(networkData.map(n => n.bandwidth)),
            connection_stability: this.assessConnectionStability(networkData),
            quality_score: this.calculateNetworkQuality(networkData)
        };
    }

    /**
     * Analyze usage patterns
     */
    analyzeUsagePatterns(history) {
        const temporalData = history.map(entry => entry.temporal).filter(Boolean);
        const userData = history.map(entry => entry.user).filter(Boolean);
        
        return {
            peak_usage_times: this.identifyPeakTimes(temporalData),
            user_behavior_patterns: this.analyzeUserBehavior(userData),
            seasonal_trends: this.identifySeasonalTrends(temporalData)
        };
    }

    /**
     * Find correlations between different context factors
     */
    findCorrelations(history) {
        const correlations = [];
        
        // Performance vs time of day
        const timePerformanceCorr = this.calculateCorrelation(
            history.map(h => h.temporal?.hour_of_day || 0),
            history.map(h => h.system?.cpu_usage || 0)
        );
        
        if (Math.abs(timePerformanceCorr) > 0.5) {
            correlations.push({
                factors: ['time_of_day', 'system_performance'],
                strength: timePerformanceCorr,
                interpretation: timePerformanceCorr > 0 ? 
                    'System performance degrades during peak hours' :
                    'System performance improves during peak hours'
            });
        }

        // Network quality vs user satisfaction
        const networkSatisfactionCorr = this.calculateCorrelation(
            history.map(h => h.network?.quality_score || 0.5),
            history.map(h => h.user?.satisfaction_indicators || 0.5)
        );
        
        if (Math.abs(networkSatisfactionCorr) > 0.4) {
            correlations.push({
                factors: ['network_quality', 'user_satisfaction'],
                strength: networkSatisfactionCorr,
                interpretation: networkSatisfactionCorr > 0 ? 
                    'Better network quality correlates with higher user satisfaction' :
                    'Network issues negatively impact user satisfaction'
            });
        }

        return correlations;
    }

    /**
     * Calculate trend direction and strength
     */
    calculateTrend(values) {
        if (values.length < 2) return { direction: 'stable', strength: 0 };

        const validValues = values.filter(v => v != null && !isNaN(v));
        if (validValues.length < 2) return { direction: 'stable', strength: 0 };

        // Simple linear regression
        const n = validValues.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const y = validValues;

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const strength = Math.abs(slope) / (Math.max(...y) - Math.min(...y) || 1);

        let direction = 'stable';
        if (slope > 0.01) direction = 'increasing';
        else if (slope < -0.01) direction = 'decreasing';

        return { direction, strength: Math.min(1, strength) };
    }

    /**
     * Calculate stability metric
     */
    calculateStability(data) {
        if (data.length === 0) return 1;

        const values = data.map(d => d.cpu_usage || 0);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stability = 1 - (Math.sqrt(variance) / 100); // Normalize to 0-1

        return Math.max(0, Math.min(1, stability));
    }

    /**
     * Calculate correlation coefficient
     */
    calculateCorrelation(x, y) {
        if (x.length !== y.length || x.length === 0) return 0;

        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Assess resource pressure
     */
    assessResourcePressure(systemData) {
        const avgCpu = systemData.reduce((sum, s) => sum + (s.cpu_usage || 0), 0) / systemData.length;
        const avgMemory = systemData.reduce((sum, s) => sum + (s.memory_usage || 0), 0) / systemData.length;
        
        const pressure = (avgCpu + avgMemory) / 200; // Normalize to 0-1
        
        if (pressure > 0.8) return 'high';
        if (pressure > 0.6) return 'medium';
        if (pressure > 0.3) return 'low';
        return 'minimal';
    }

    /**
     * Export context data
     */
    export() {
        return {
            configuration: {
                enabled_sensors: this.enabledSensors,
                sampling_interval: this.samplingInterval,
                retention_period: this.retentionPeriod
            },
            history: this.contextHistory,
            trends: this.getContextTrends(),
            export_timestamp: new Date().toISOString()
        };
    }
}

/**
 * System Context Sensor
 */
class SystemSensor {
    capture() {
        // In a real implementation, these would interface with actual system APIs
        return {
            cpu_usage: this.getCpuUsage(),
            memory_usage: this.getMemoryUsage(),
            disk_usage: this.getDiskUsage(),
            active_processes: this.getActiveProcessCount(),
            system_load: this.getSystemLoad(),
            uptime: this.getSystemUptime(),
            temperature: this.getSystemTemperature()
        };
    }

    getCpuUsage() {
        // Mock implementation - would use os.loadavg() or similar
        return Math.random() * 100;
    }

    getMemoryUsage() {
        // Mock implementation - would use process.memoryUsage() or similar
        return Math.random() * 100;
    }

    getDiskUsage() {
        return Math.random() * 100;
    }

    getActiveProcessCount() {
        return Math.floor(Math.random() * 200) + 50;
    }

    getSystemLoad() {
        const loads = ['low', 'medium', 'high', 'critical'];
        return loads[Math.floor(Math.random() * loads.length)];
    }

    getSystemUptime() {
        return Math.floor(Math.random() * 86400000); // Up to 24 hours in ms
    }

    getSystemTemperature() {
        return Math.random() * 40 + 30; // 30-70°C range
    }
}

/**
 * Network Context Sensor
 */
class NetworkSensor {
    capture() {
        return {
            connection_type: this.getConnectionType(),
            latency: this.getLatency(),
            bandwidth: this.getBandwidth(),
            packet_loss: this.getPacketLoss(),
            dns_response_time: this.getDnsResponseTime(),
            connection_stability: this.getConnectionStability(),
            quality_score: this.calculateQualityScore()
        };
    }

    getConnectionType() {
        const types = ['wifi', 'ethernet', 'cellular', 'satellite'];
        return types[Math.floor(Math.random() * types.length)];
    }

    getLatency() {
        return Math.random() * 200 + 10; // 10-210ms
    }

    getBandwidth() {
        return Math.random() * 1000 + 100; // 100-1100 Mbps
    }

    getPacketLoss() {
        return Math.random() * 0.05; // 0-5% packet loss
    }

    getDnsResponseTime() {
        return Math.random() * 100 + 5; // 5-105ms
    }

    getConnectionStability() {
        return Math.random(); // 0-1 stability score
    }

    calculateQualityScore() {
        const latency = this.getLatency();
        const bandwidth = this.getBandwidth();
        const packetLoss = this.getPacketLoss();
        
        // Simple quality calculation
        let score = 1.0;
        score -= Math.min(0.5, latency / 400); // Penalize high latency
        score -= Math.min(0.3, packetLoss * 10); // Penalize packet loss
        score += Math.min(0.2, bandwidth / 5000); // Reward high bandwidth
        
        return Math.max(0, Math.min(1, score));
    }
}

/**
 * Temporal Context Sensor
 */
class TemporalSensor {
    capture() {
        const now = new Date();
        
        return {
            timestamp: now.toISOString(),
            hour_of_day: now.getHours(),
            day_of_week: now.getDay(),
            day_of_month: now.getDate(),
            month: now.getMonth(),
            year: now.getFullYear(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            is_weekend: now.getDay() === 0 || now.getDay() === 6,
            is_business_hours: this.isBusinessHours(now),
            season: this.getSeason(now),
            lunar_phase: this.getMockLunarPhase(),
            holiday_proximity: this.getHolidayProximity(now)
        };
    }

    isBusinessHours(date) {
        const hour = date.getHours();
        const day = date.getDay();
        return day >= 1 && day <= 5 && hour >= 9 && hour <= 17;
    }

    getSeason(date) {
        const month = date.getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    getMockLunarPhase() {
        const phases = ['new', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
                       'full', 'waning_gibbous', 'last_quarter', 'waning_crescent'];
        return phases[Math.floor(Math.random() * phases.length)];
    }

    getHolidayProximity(date) {
        // Mock implementation - in reality would check against holiday calendar
        return Math.random() < 0.1 ? 'within_week' : 'distant';
    }
}

/**
 * User Context Sensor
 */
class UserSensor {
    capture() {
        return {
            session_duration: this.getSessionDuration(),
            activity_level: this.getActivityLevel(),
            interaction_patterns: this.getInteractionPatterns(),
            preference_indicators: this.getPreferenceIndicators(),
            satisfaction_indicators: this.getSatisfactionIndicators(),
            expertise_level: this.getExpertiseLevel(),
            goal_progress: this.getGoalProgress(),
            multitasking_level: this.getMultitaskingLevel()
        };
    }

    getSessionDuration() {
        return Math.random() * 3600000; // Up to 1 hour in ms
    }

    getActivityLevel() {
        const levels = ['low', 'moderate', 'high', 'very_high'];
        return levels[Math.floor(Math.random() * levels.length)];
    }

    getInteractionPatterns() {
        return {
            mouse_movement_speed: Math.random() * 1000,
            click_frequency: Math.random() * 60,
            scroll_behavior: ['smooth', 'rapid', 'erratic'][Math.floor(Math.random() * 3)],
            navigation_style: ['linear', 'exploratory', 'focused'][Math.floor(Math.random() * 3)]
        };
    }

    getPreferenceIndicators() {
        return {
            ui_complexity_preference: ['minimal', 'moderate', 'rich'][Math.floor(Math.random() * 3)],
            information_density: ['sparse', 'moderate', 'dense'][Math.floor(Math.random() * 3)],
            feedback_frequency: ['minimal', 'moderate', 'frequent'][Math.floor(Math.random() * 3)]
        };
    }

    getSatisfactionIndicators() {
        return Math.random(); // 0-1 satisfaction score
    }

    getExpertiseLevel() {
        const levels = ['novice', 'beginner', 'intermediate', 'advanced', 'expert'];
        return levels[Math.floor(Math.random() * levels.length)];
    }

    getGoalProgress() {
        return Math.random(); // 0-1 progress score
    }

    getMultitaskingLevel() {
        return Math.floor(Math.random() * 5) + 1; // 1-5 concurrent tasks
    }
}

/**
 * Application Context Sensor
 */
class ApplicationSensor {
    capture() {
        return {
            version: this.getApplicationVersion(),
            feature_usage: this.getFeatureUsage(),
            error_rate: this.getErrorRate(),
            performance_metrics: this.getPerformanceMetrics(),
            concurrent_users: this.getConcurrentUsers(),
            feature_flags: this.getActiveFeatureFlags(),
            a_b_test_variants: this.getABTestVariants(),
            cache_hit_rate: this.getCacheHitRate()
        };
    }

    getApplicationVersion() {
        return '1.0.0'; // Mock version
    }

    getFeatureUsage() {
        return {
            most_used_features: ['search', 'navigation', 'content_creation'],
            least_used_features: ['advanced_settings', 'import_export'],
            feature_adoption_rate: Math.random()
        };
    }

    getErrorRate() {
        return Math.random() * 0.05; // 0-5% error rate
    }

    getPerformanceMetrics() {
        return {
            response_time: Math.random() * 2000 + 100, // 100-2100ms
            throughput: Math.random() * 1000 + 100, // requests per second
            memory_footprint: Math.random() * 512 + 64 // MB
        };
    }

    getConcurrentUsers() {
        return Math.floor(Math.random() * 1000) + 1;
    }

    getActiveFeatureFlags() {
        return ['new_ui', 'enhanced_search', 'beta_analytics'];
    }

    getABTestVariants() {
        return {
            ui_test: ['variant_a', 'variant_b'][Math.floor(Math.random() * 2)],
            algorithm_test: ['control', 'experimental'][Math.floor(Math.random() * 2)]
        };
    }

    getCacheHitRate() {
        return Math.random() * 0.4 + 0.6; // 60-100% hit rate
    }
}

module.exports = ContextCapture;