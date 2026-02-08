# data encryption and decryption utilities
from cryptography.fernet import Fernet
from app.core.config import settings

# The key comes from your .env file
cipher_suite = Fernet(settings.DB_ENCRYPTION_KEY)

def encrypt_data(text: str) -> bytes:
    """Converts raw text into 'Locked' bytes"""
    return cipher_suite.encrypt(text.encode())

def decrypt_data(token: bytes) -> str:
    """Converts locked bytes back into 'Readable' text"""
    return cipher_suite.decrypt(token).decode()