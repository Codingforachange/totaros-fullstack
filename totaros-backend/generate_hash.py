import bcrypt

# Define the customer username and password
username = "admin_totaro"
password = "CustomerSecretPassword2026!"

# Hash the password with a secure salt
hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

print(f"--- Copy these values for your Database insertion ---")
print(f"Username: {username}")
print(f"Hased Password (Store this string): {hashed_password.decode('utf-8')}")