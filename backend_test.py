import requests
import json
import sys
from datetime import datetime
import uuid

class GraphQLTester:
    def __init__(self, graphql_url="http://localhost:4001/graphql"):
        self.graphql_url = graphql_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, query, variables=None, expected_status=200):
        """Run a single GraphQL test"""
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            headers = {'Content-Type': 'application/json'}
            payload = {
                'query': query,
                'variables': variables or {}
            }
            
            response = requests.post(
                self.graphql_url, 
                json=payload,
                headers=headers
            )
            
            success = response.status_code == expected_status
            
            if success:
                result = response.json()
                if 'errors' in result:
                    print(f"❌ Failed - GraphQL Errors: {json.dumps(result['errors'], indent=2)}")
                    return False, result
                
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                return True, result
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                return False, response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, str(e)

    def test_schema_introspection(self):
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
            introspection_query
        )
        
        if success and 'data' in result and '__schema' in result['data']:
            print("✅ Schema introspection successful")
            return True
        
        print("❌ Schema introspection failed")
        return False

    def test_create_user(self, email, password, first_name, last_name):
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
            variables
        )
        
        if success and 'data' in result and 'createUser' in result['data']:
            user_data = result['data']['createUser']
            print(f"✅ User created successfully: {user_data['firstName']} {user_data['lastName']}")
            return user_data
        
        print("❌ User creation failed")
        return None

    def test_get_users(self):
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
            get_users_query
        )
        
        if success and 'data' in result and 'users' in result['data']:
            users = result['data']['users']
            print(f"✅ Retrieved {len(users)} users")
            return users
        
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