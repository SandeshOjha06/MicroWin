# data encryption and decryption utilities
from cryptography.fernet import Fernet
from app.core.config import settings
from passlib.context import CryptContext

# The key comes from your .env file
cipher_suite = Fernet(settings.DB_ENCRYPTION_KEY)

def encrypt_data(text: str) -> bytes:
    """Converts raw text into 'Locked' bytes"""
    return cipher_suite.encrypt(text.encode())

def decrypt_data(token: bytes) -> str:
    """Converts locked bytes back into 'Readable' text"""
    return cipher_suite.decrypt(token).decode()


# By using bcrypt_sha256, passlib handles the 72-byte limit for us
# by pre-hashing the password internally before giving it to bcrypt.
pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")

def hash_password(password: str) -> str:
    """Securely hashes a password."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored hash."""
    return pwd_context.verify(plain_password, hashed_password)
