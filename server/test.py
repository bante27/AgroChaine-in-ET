import requests

BASE_URL = "http://localhost:5000/api"

def print_response(resp):
    print(f"Status: {resp.status_code}")
    try:
        print(resp.json())
    except:
        print(resp.text)
    print("-" * 40)

def register():
    print("Registering user...")
    data = {
        "fullName": "John Doe",
        "email": "john@example.com",
        "password": "StrongPass1!",
        "phone": "+1234567890",
        "address": "123 Main St"
    }
    resp = requests.post(f"{BASE_URL}/users/register", json=data)
    print_response(resp)
    return resp.json().get('token')

def login():
    print("Logging in...")
    data = {
        "email": "john@example.com",
        "password": "StrongPass1!"
    }
    resp = requests.post(f"{BASE_URL}/users/login", json=data)
    print_response(resp)
    return resp.json().get('token')

def get_profile(token):
    print("Getting profile...")
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(f"{BASE_URL}/users/profile", headers=headers)
    print_response(resp)

def update_profile(token):
    print("Updating profile...")
    headers = {"Authorization": f"Bearer {token}"}
    data = {"username": "johnny", "location": "New York"}
    resp = requests.patch(f"{BASE_URL}/users/profile", json=data, headers=headers)
    print_response(resp)

def add_product(token):
    print("Adding product...")
    headers = {"Authorization": f"Bearer {token}"}
    files = {
        'images': open('apple.jpg', 'rb') 
    }
    data = {
        "title": "Fresh Apples",
        "price": "100",
        "originAddress": "Farm 123",
        "type": "Fruit",
        "quantity": "50",
        "availableQuantity": "50",
        "description": "Freshly picked apples",
        "comment": "Available for immediate delivery"
    }
    resp = requests.post(f"{BASE_URL}/products", headers=headers, data=data, files=files)
    print_response(resp)
    if resp.status_code == 201:
        return resp.json()['product']['productId']
    return None

def get_products():
    print("Getting products...")
    resp = requests.get(f"{BASE_URL}/products")
    print_response(resp)

def buy_product(token, product_id):
    print("Buying product...")
    headers = {"Authorization": f"Bearer {token}"}
    data = {"productId": product_id, "quantity": 2}
    resp = requests.post(f"{BASE_URL}/transactions/buy", json=data, headers=headers)
    print_response(resp)

def get_transactions(token):
    print("Getting transaction history...")
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(f"{BASE_URL}/transactions/history", headers=headers)
    print_response(resp)

if __name__ == "__main__":
    token = register()
    if not token:
        token = login()

    if token:
        get_profile(token)
        update_profile(token)
        product_id = add_product(token)
        get_products()
        if product_id:
            buy_product(token, product_id)
            get_transactions(token)
    else:
        print("Failed to get auth token, cannot proceed.")
