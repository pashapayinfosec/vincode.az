import requests
import sys
import json
from datetime import datetime

class VINCheckAPITester:
    def __init__(self, base_url="https://vin-decoder-8.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_order_id = None
        self.test_tracking_code = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, use_token_param=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        
        # For admin endpoints, pass token as query parameter
        params = {}
        if use_token_param and self.admin_token:
            params['token'] = self.admin_token
        elif data and isinstance(data, dict):
            params = data

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, params=params)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.text}")
                except:
                    pass
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_public_settings(self):
        """Test public settings endpoint"""
        success, response = self.run_test("Public Settings", "GET", "settings/public", 200)
        if success:
            required_fields = ["price_azn", "hero_title", "hero_subtitle", "primary_color"]
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field: {field}")
                    return False
            print(f"   Price: {response.get('price_azn')} AZN")
        return success

    def test_create_order(self):
        """Test order creation"""
        test_order = {
            "vin": "1HGCM82633A004329",
            "car_model": "Honda Accord 2020",
            "name": "Test User",
            "phone": "+994501234567",
            "email": "test@example.com",
            "delivery_method": "email"
        }
        
        success, response = self.run_test("Create Order", "POST", "orders", 200, test_order)
        if success:
            self.test_order_id = response.get("order_id")
            self.test_tracking_code = response.get("tracking_code")
            print(f"   Order ID: {self.test_order_id}")
            print(f"   Tracking Code: {self.test_tracking_code}")
        return success

    def test_create_order_invalid_vin(self):
        """Test order creation with invalid VIN"""
        test_order = {
            "vin": "INVALID",  # Too short
            "car_model": "Honda Accord 2020",
            "name": "Test User",
            "phone": "+994501234567",
            "email": "test@example.com",
            "delivery_method": "email"
        }
        
        return self.run_test("Create Order (Invalid VIN)", "POST", "orders", 400, test_order)

    def test_mock_payment(self):
        """Test mock PayPal payment"""
        if not self.test_order_id:
            print("❌ No order ID available for payment test")
            return False
            
        return self.run_test("Mock Payment", "POST", f"orders/{self.test_order_id}/pay", 200)

    def test_track_order(self):
        """Test order tracking"""
        if not self.test_tracking_code:
            print("❌ No tracking code available for tracking test")
            return False
            
        track_data = {"tracking_code": self.test_tracking_code}
        success, response = self.run_test("Track Order", "POST", "orders/track", 200, track_data)
        if success:
            print(f"   Status: {response.get('status')}")
            print(f"   Payment Status: {response.get('payment_status')}")
        return success

    def test_track_order_invalid(self):
        """Test tracking with invalid code"""
        track_data = {"tracking_code": "INVALID-CODE"}
        return self.run_test("Track Order (Invalid)", "POST", "orders/track", 404, track_data)

    def test_admin_login(self):
        """Test admin login"""
        login_data = {"username": "admin", "password": "admin123"}
        success, response = self.run_test("Admin Login", "POST", "admin/login", 200, login_data)
        if success:
            self.admin_token = response.get("token")
            print(f"   Token received: {self.admin_token[:20]}..." if self.admin_token else "No token")
        return success

    def test_admin_login_invalid(self):
        """Test admin login with wrong credentials"""
        login_data = {"username": "admin", "password": "wrongpassword"}
        return self.run_test("Admin Login (Invalid)", "POST", "admin/login", 401, login_data)

    def test_admin_orders(self):
        """Test admin orders list"""
        if not self.admin_token:
            print("❌ No admin token available")
            return False
            
        success, response = self.run_test("Admin Orders", "GET", "admin/orders", 200, {"token": self.admin_token})
        if success:
            print(f"   Found {len(response)} orders")
        return success

    def test_admin_stats(self):
        """Test admin dashboard stats"""
        if not self.admin_token:
            print("❌ No admin token available")
            return False
            
        success, response = self.run_test("Admin Stats", "GET", "admin/stats", 200, {"token": self.admin_token})
        if success:
            stats = ["total_orders", "paid_orders", "waiting_orders", "total_revenue"]
            for stat in stats:
                if stat in response:
                    print(f"   {stat}: {response[stat]}")
        return success

    def test_admin_settings(self):
        """Test admin settings"""
        if not self.admin_token:
            print("❌ No admin token available")
            return False
            
        return self.run_test("Admin Settings", "GET", "admin/settings", 200, {"token": self.admin_token})

    def test_admin_update_settings(self):
        """Test admin settings update"""
        if not self.admin_token:
            print("❌ No admin token available")
            return False
            
        update_data = {"price_azn": 20.0}
        return self.run_test("Admin Update Settings", "PUT", "admin/settings", 200, update_data, use_token_param=True)

    def test_admin_customers(self):
        """Test admin customers list"""
        if not self.admin_token:
            print("❌ No admin token available")
            return False
            
        success, response = self.run_test("Admin Customers", "GET", "admin/customers", 200, {"token": self.admin_token})
        if success:
            print(f"   Found {len(response)} customers")
        return success

    def test_admin_payments(self):
        """Test admin payments list"""
        if not self.admin_token:
            print("❌ No admin token available")
            return False
            
        success, response = self.run_test("Admin Payments", "GET", "admin/payments", 200, {"token": self.admin_token})
        if success:
            print(f"   Found {len(response)} payments")
        return success

    def test_admin_order_detail(self):
        """Test admin order detail"""
        if not self.admin_token or not self.test_order_id:
            print("❌ No admin token or order ID available")
            return False
            
        return self.run_test("Admin Order Detail", "GET", f"admin/orders/{self.test_order_id}", 200, {"token": self.admin_token})

    def test_admin_update_order(self):
        """Test admin order update"""
        if not self.admin_token or not self.test_order_id:
            print("❌ No admin token or order ID available")
            return False
            
        update_data = {"status": "yoxlanılır", "result_text": "Test result text"}
        return self.run_test("Admin Update Order", "PUT", f"admin/orders/{self.test_order_id}", 200, update_data, use_token_param=True)

def main():
    print("🚀 Starting VINCheck API Tests")
    print("=" * 50)
    
    tester = VINCheckAPITester()
    
    # Public API Tests
    print("\n📋 PUBLIC API TESTS")
    print("-" * 30)
    tester.test_root_endpoint()
    tester.test_public_settings()
    tester.test_create_order()
    tester.test_create_order_invalid_vin()
    tester.test_mock_payment()
    tester.test_track_order()
    tester.test_track_order_invalid()
    
    # Admin API Tests
    print("\n🔐 ADMIN API TESTS")
    print("-" * 30)
    tester.test_admin_login()
    tester.test_admin_login_invalid()
    tester.test_admin_orders()
    tester.test_admin_stats()
    tester.test_admin_settings()
    tester.test_admin_update_settings()
    tester.test_admin_customers()
    tester.test_admin_payments()
    tester.test_admin_order_detail()
    tester.test_admin_update_order()
    
    # Results
    print("\n" + "=" * 50)
    print(f"📊 RESULTS: {tester.tests_passed}/{tester.tests_run} tests passed")
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())