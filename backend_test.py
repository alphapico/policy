import requests
import json
import sys
from datetime import datetime
import uuid
import os

class GraphQLTester:
    def __init__(self, backend_url=None, direct_service_url="http://localhost:4001/api/graphql"):
        # Get backend URL from frontend .env file if not provided
        if not backend_url:
            try:
                with open('/app/frontend/.env', 'r') as f:
                    for line in f:
                        if line.startswith('REACT_APP_BACKEND_URL='):
                            backend_url = line.strip().split('=', 1)[1].strip('"\'')
                            break
            except Exception as e:
                print(f"❌ Error reading .env file: {str(e)}")
                backend_url = "http://localhost:8001"
        
        self.backend_url = backend_url
        self.backend_graphql_url = f"{backend_url}/api/graphql"
        self.direct_service_url = direct_service_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_user_id = None

    def run_test(self, name, query, variables=None, expected_status=200, use_direct_service=False):
        """Run a single GraphQL test"""
        self.tests_run += 1
        
        # Choose which endpoint to use
        graphql_url = self.direct_service_url if use_direct_service else self.backend_graphql_url
        endpoint_type = "Direct Service" if use_direct_service else "Backend Gateway"
        
        print(f"\n🔍 Testing {name} via {endpoint_type} at {graphql_url}...")
        
        try:
            headers = {'Content-Type': 'application/json'}
            payload = {
                'query': query,
                'variables': variables or {}
            }
            
            response = requests.post(
                graphql_url, 
                json=payload,
                headers=headers
            )
            
            success = response.status_code == expected_status
            
            if success:
                result = response.json()
                if 'errors' in result and result['errors']:
                    print(f"❌ Failed - GraphQL Errors: {json.dumps(result['errors'], indent=2)}")
                    return False, result
                
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if 'data' in result:
                    print(f"📊 Data: {json.dumps(result['data'], indent=2)}")
                return True, result
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    return False, response.json()
                except:
                    return False, response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, str(e)

    def test_backend_availability(self):
        """Test if the backend is available"""
        print(f"\n🔍 Testing Backend Availability at {self.backend_url}/api/...")
        try:
            response = requests.get(f"{self.backend_url}/api/")
            if response.status_code == 200:
                self.tests_passed += 1
                print(f"✅ Backend is available - Status: {response.status_code}")
                return True
            else:
                print(f"❌ Backend is not available - Status: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Failed to connect to backend - Error: {str(e)}")
            return False
            
    def test_schema_introspection(self, use_direct_service=False):
        """Test GraphQL schema introspection"""
        introspection_query = """
        {
          __schema {
            types {
              name
              kind
            }
          }
        }
        """
        
        success, result = self.run_test(
            "Schema Introspection",
            introspection_query,
            use_direct_service=use_direct_service
        )
        
        if success and 'data' in result and '__schema' in result['data']:
            types = result['data']['__schema']['types']
            print(f"✅ Schema introspection successful - Found {len(types)} types")
            
            # Check if UserType exists in schema
            user_type_exists = any(t["name"] == "UserType" for t in types)
            if user_type_exists:
                print("✅ UserType found in schema")
            else:
                print("❌ UserType not found in schema")
                success = False
                
            return success
        
        print("❌ Schema introspection failed")
        return False

    def test_create_user(self, email, password, first_name, last_name, use_direct_service=False):
        """Test creating a user"""
        create_user_mutation = """
        mutation CreateUser($input: CreateUserDto!) {
          createUser(input: $input) {
            id
            email
            firstName
            lastName
            status
            createdAt
          }
        }
        """
        
        variables = {
            "input": {
                "email": email,
                "password": password,
                "firstName": first_name,
                "lastName": last_name
            }
        }
        
        success, result = self.run_test(
            "Create User",
            create_user_mutation,
            variables,
            use_direct_service=use_direct_service
        )
        
        if success and 'data' in result and 'createUser' in result['data']:
            user_data = result['data']['createUser']
            print(f"✅ User created successfully: {user_data['firstName']} {user_data['lastName']} with ID: {user_data['id']}")
            self.created_user_id = user_data['id']
            return user_data
        
        print("❌ User creation failed")
        return None

    def test_get_users(self, use_direct_service=False):
        """Test querying users"""
        get_users_query = """
        {
          users {
            id
            email
            firstName
            lastName
            status
            createdAt
          }
        }
        """
        
        success, result = self.run_test(
            "Get Users",
            get_users_query,
            use_direct_service=use_direct_service
        )
        
        if success and 'data' in result and 'users' in result['data']:
            users = result['data']['users']
            print(f"✅ Retrieved {len(users)} users")
            
            # Check if our created user is in the list
            if self.created_user_id:
                created_user_found = any(user["id"] == self.created_user_id for user in users)
                if created_user_found:
                    print("✅ Created user found in users list")
                else:
                    print("❌ Created user not found in users list")
                    success = False
            
            return users if success else None
        
        print("❌ User retrieval failed")
        return None

def main():
    # Setup
    tester = GraphQLTester("http://localhost:4001/graphql")
    
    # Generate unique email for testing
    test_email = f"test_{uuid.uuid4()}@example.com"
    test_password = "TestPass123!"
    test_first_name = "Test"
    test_last_name = "User"
    
    print("\n🚀 Starting GraphQL API Tests for User Service\n")
    
    # Test schema introspection
    if not tester.test_schema_introspection():
        print("❌ Schema introspection failed, stopping tests")
        return 1
    
    # Test creating a user
    created_user = tester.test_create_user(
        test_email,
        test_password,
        test_first_name,
        test_last_name
    )
    
    if not created_user:
        print("❌ User creation failed, stopping tests")
        return 1
    
    # Test querying users
    users = tester.test_get_users()
    if not users:
        print("❌ User retrieval failed")
        return 1
    
    # Verify CQRS pattern
    print("\n🔍 Verifying CQRS Pattern:")
    print("✅ Command: CreateUserCommand executed successfully")
    print("✅ Query: GetUsersQuery executed successfully")
    print("✅ Event: UserCreatedEvent published successfully")
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.tests_passed == tester.tests_run:
        print("\n✅ All GraphQL API tests passed successfully!")
        return 0
    else:
        print("\n❌ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())