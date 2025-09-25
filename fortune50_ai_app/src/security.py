"""Security module for handling secrets management and security measures."""
import logging
import hashlib
import hmac
import os
import time
from typing import Dict, Any, Optional, List
import hvac  # HashiCorp Vault client
from hvac.exceptions import VaultError
from config import Config


class SecurityManager:
    """Handles security measures including Vault integration and data protection."""
    
    def __init__(self):
        """Initialize the security manager."""
        self.logger = logging.getLogger(__name__)
        self.config = Config()
        self.vault_client = None
        self.is_authenticated = False
        
        # Initialize Vault client
        self._initialize_vault()
    
    def _initialize_vault(self) -> None:
        """Initialize HashiCorp Vault client."""
        try:
            self.vault_client = hvac.Client(url=self.config.VAULT_URL)
            
            # Authenticate with Vault if token is provided
            if self.config.VAULT_TOKEN:
                self.vault_client.token = self.config.VAULT_TOKEN
                if self.vault_client.is_authenticated():
                    self.is_authenticated = True
                    self.logger.info("Successfully authenticated with Vault")
                else:
                    self.logger.warning("Vault token provided but authentication failed")
            else:
                self.logger.info("No Vault token provided - some security features will be limited")
                
        except Exception as e:
            self.logger.warning(f"Could not initialize Vault client: {str(e)}")
            self.logger.info("Running without Vault integration")
    
    def get_secret(self, secret_path: str) -> Optional[Dict[str, Any]]:
        """Retrieve a secret from Vault."""
        if not self.vault_client or not self.is_authenticated:
            self.logger.warning("Vault not available - cannot retrieve secrets")
            return None
        
        try:
            response = self.vault_client.secrets.kv.read_secret_version(path=secret_path)
            self.logger.info(f"Successfully retrieved secret from path: {secret_path}")
            return response['data']['data']
            
        except VaultError as e:
            self.logger.error(f"Vault error retrieving secret from {secret_path}: {str(e)}")
            return None
        except Exception as e:
            self.logger.error(f"Unexpected error retrieving secret: {str(e)}")
            return None
    
    def store_secret(self, secret_path: str, secret_data: Dict[str, Any]) -> bool:
        """Store a secret in Vault."""
        if not self.vault_client or not self.is_authenticated:
            self.logger.warning("Vault not available - cannot store secrets")
            return False
        
        try:
            self.vault_client.secrets.kv.create_or_update_secret(
                path=secret_path,
                secret=secret_data
            )
            self.logger.info(f"Successfully stored secret at path: {secret_path}")
            return True
            
        except VaultError as e:
            self.logger.error(f"Vault error storing secret to {secret_path}: {str(e)}")
            return False
        except Exception as e:
            self.logger.error(f"Unexpected error storing secret: {str(e)}")
            return False
    
    def anonymize_patient_data(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Anonymize patient data for HIPAA compliance."""
        anonymized_data = patient_data.copy()
        
        # Define PII fields that should be anonymized or removed
        pii_fields = [
            'patient_id', 'ssn', 'name', 'first_name', 'last_name',
            'address', 'phone', 'email', 'date_of_birth', 'mrn'
        ]
        
        for field in pii_fields:
            if field in anonymized_data:
                if field in ['patient_id', 'mrn']:
                    # Create anonymous ID
                    anonymized_data[f'anonymous_{field}'] = self._create_anonymous_id(
                        anonymized_data[field]
                    )
                elif field == 'date_of_birth':
                    # Convert to age range
                    if anonymized_data[field]:
                        age = self._calculate_age_from_dob(anonymized_data[field])
                        anonymized_data['age_range'] = self._get_age_range(age)
                
                # Remove original PII field
                del anonymized_data[field]
        
        # Add anonymization metadata
        anonymized_data['_anonymized'] = True
        anonymized_data['_anonymization_timestamp'] = time.time()
        
        self.logger.info("Patient data anonymized for HIPAA compliance")
        return anonymized_data
    
    def _create_anonymous_id(self, original_id: str) -> str:
        """Create an anonymous ID using cryptographic hashing."""
        # Use HMAC with a secret key for consistent but secure anonymization
        secret_key = os.getenv('ANONYMIZATION_KEY', 'default_key_change_in_production')
        return hmac.new(
            secret_key.encode(),
            original_id.encode(),
            hashlib.sha256
        ).hexdigest()[:16]
    
    def _calculate_age_from_dob(self, date_of_birth: str) -> int:
        """Calculate age from date of birth (simplified)."""
        # This is a simplified implementation
        # In production, use proper date parsing
        try:
            from datetime import datetime
            dob = datetime.strptime(date_of_birth, '%Y-%m-%d')
            today = datetime.now()
            return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        except:
            return 0  # Default if parsing fails
    
    def _get_age_range(self, age: int) -> str:
        """Convert age to age range for privacy."""
        if age < 18:
            return 'under_18'
        elif age < 30:
            return '18_29'
        elif age < 50:
            return '30_49'
        elif age < 65:
            return '50_64'
        else:
            return '65_plus'
    
    def encrypt_sensitive_data(self, data: str, key_name: str = 'default') -> Optional[str]:
        """Encrypt sensitive data using Vault's transit engine."""
        if not self.vault_client or not self.is_authenticated:
            self.logger.warning("Vault not available - cannot encrypt data")
            return None
        
        try:
            # Use Vault's transit engine for encryption
            response = self.vault_client.secrets.transit.encrypt_data(
                name=key_name,
                plaintext=data
            )
            encrypted_data = response['data']['ciphertext']
            self.logger.debug(f"Successfully encrypted data using key: {key_name}")
            return encrypted_data
            
        except Exception as e:
            self.logger.error(f"Error encrypting data: {str(e)}")
            return None
    
    def decrypt_sensitive_data(self, encrypted_data: str, key_name: str = 'default') -> Optional[str]:
        """Decrypt sensitive data using Vault's transit engine."""
        if not self.vault_client or not self.is_authenticated:
            self.logger.warning("Vault not available - cannot decrypt data")
            return None
        
        try:
            # Use Vault's transit engine for decryption
            response = self.vault_client.secrets.transit.decrypt_data(
                name=key_name,
                ciphertext=encrypted_data
            )
            decrypted_data = response['data']['plaintext']
            self.logger.debug(f"Successfully decrypted data using key: {key_name}")
            return decrypted_data
            
        except Exception as e:
            self.logger.error(f"Error decrypting data: {str(e)}")
            return None
    
    def audit_data_access(self, user_id: str, data_type: str, action: str, 
                         additional_info: Optional[Dict[str, Any]] = None) -> None:
        """Log data access for audit purposes."""
        audit_entry = {
            'timestamp': time.time(),
            'user_id': user_id,
            'data_type': data_type,
            'action': action,
            'source_ip': os.getenv('CLIENT_IP', 'unknown'),
            'application': self.config.APP_NAME,
            'version': self.config.APP_VERSION
        }
        
        if additional_info:
            audit_entry.update(additional_info)
        
        # Log audit entry
        audit_logger = logging.getLogger('audit')
        audit_logger.info(f"Data Access: {action} on {data_type} by {user_id}", extra=audit_entry)
        
        # In production, you might also send this to a SIEM system
        # or store in a separate audit database
    
    def validate_hipaa_compliance(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate data for HIPAA compliance."""
        compliance_report = {
            'timestamp': time.time(),
            'compliant': True,
            'issues': [],
            'recommendations': []
        }
        
        # Check for potential PII
        pii_patterns = [
            'ssn', 'social_security', 'patient_id', 'mrn', 'medical_record',
            'name', 'address', 'phone', 'email', 'date_of_birth', 'dob'
        ]
        
        for key, value in data.items():
            key_lower = key.lower()
            
            # Check if key indicates PII
            if any(pattern in key_lower for pattern in pii_patterns):
                compliance_report['compliant'] = False
                compliance_report['issues'].append(f"Potential PII detected in field: {key}")
                compliance_report['recommendations'].append(f"Consider anonymizing field: {key}")
            
            # Check for patterns in values (simplified)
            if isinstance(value, str):
                # Check for SSN pattern
                if len(value) == 11 and value.count('-') == 2:
                    compliance_report['compliant'] = False
                    compliance_report['issues'].append(f"Potential SSN pattern in field: {key}")
                
                # Check for email pattern
                if '@' in value and '.' in value:
                    compliance_report['compliant'] = False
                    compliance_report['issues'].append(f"Potential email address in field: {key}")
        
        # Log compliance check
        compliance_logger = logging.getLogger('compliance')
        if compliance_report['compliant']:
            compliance_logger.info("Data passed HIPAA compliance validation")
        else:
            compliance_logger.warning(f"Data failed HIPAA compliance: {len(compliance_report['issues'])} issues found")
        
        return compliance_report
    
    def get_security_status(self) -> Dict[str, Any]:
        """Get current security status."""
        return {
            'vault_available': self.vault_client is not None,
            'vault_authenticated': self.is_authenticated,
            'vault_url': self.config.VAULT_URL,
            'encryption_available': self.is_authenticated,
            'anonymization_enabled': True,
            'audit_logging_enabled': True,
            'hipaa_compliance_checking': True
        }
    
    def create_security_token(self, user_id: str, expiry_minutes: int = 60) -> Optional[str]:
        """Create a temporary security token for API access."""
        try:
            import jwt
            import datetime
            
            payload = {
                'user_id': user_id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=expiry_minutes),
                'iat': datetime.datetime.utcnow(),
                'app': self.config.APP_NAME
            }
            
            # In production, get this secret from Vault
            secret = os.getenv('JWT_SECRET', 'change_this_in_production')
            token = jwt.encode(payload, secret, algorithm='HS256')
            
            self.logger.info(f"Created security token for user: {user_id}")
            return token
            
        except ImportError:
            self.logger.warning("JWT library not available - cannot create tokens")
            return None
        except Exception as e:
            self.logger.error(f"Error creating security token: {str(e)}")
            return None
    
    def validate_security_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Validate a security token."""
        try:
            import jwt
            
            # In production, get this secret from Vault
            secret = os.getenv('JWT_SECRET', 'change_this_in_production')
            payload = jwt.decode(token, secret, algorithms=['HS256'])
            
            self.logger.debug(f"Validated token for user: {payload.get('user_id')}")
            return payload
            
        except ImportError:
            self.logger.warning("JWT library not available - cannot validate tokens")
            return None
        except jwt.ExpiredSignatureError:
            self.logger.warning("Token has expired")
            return None
        except jwt.InvalidTokenError:
            self.logger.warning("Invalid token provided")
            return None
        except Exception as e:
            self.logger.error(f"Error validating token: {str(e)}")
            return None