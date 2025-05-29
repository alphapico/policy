import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './App.css';

// GraphQL Queries and Mutations
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      firstName
      lastName
      status
      createdAt
    }
  }
`;

const CREATE_USER = gql`
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
`;

function App() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  // GraphQL Hooks
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [createUser, { loading: creating }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      setShowForm(false);
      setFormData({ email: '', password: '', firstName: '', lastName: '' });
      refetch(); // Refresh the users list
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser({
      variables: {
        input: formData
      }
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                🏪 E-Commerce Microservices
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                User Service Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                Microservices Architecture
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                NestJS • GraphQL • CQRS • MongoDB • Event-Driven
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <span className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                  ✅ User Service
                </span>
                <span className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  🔄 Product Service
                </span>
                <span className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  🔄 Order Service
                </span>
                <span className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  🔄 Payment Service
                </span>
                <span className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  🔄 Notification Service
                </span>
              </div>
            </div>
          </div>

          {/* Users Management Section */}
          <div className="bg-white rounded-lg shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">👥 User Management</h3>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  {showForm ? 'Cancel' : 'Add User'}
                </button>
              </div>
            </div>

            {/* Add User Form */}
            {showForm && (
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-4">
                    <button
                      type="submit"
                      disabled={creating}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                    >
                      {creating ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users List */}
            <div className="px-6 py-4">
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <strong>Error:</strong> {error.message}
                </div>
              )}

              {data && data.users && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.users.map((user) => (
                    <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ID: {user.id}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {data && data.users && data.users.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No users found. Create your first user!</p>
                </div>
              )}
            </div>
          </div>

          {/* Architecture Info */}
          <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🏗️ Architecture Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔄</span>
                </div>
                <h4 className="font-semibold text-gray-900">CQRS Pattern</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Command Query Responsibility Segregation implemented in User Service
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔗</span>
                </div>
                <h4 className="font-semibold text-gray-900">GraphQL API</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Type-safe API with Apollo Client integration
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📡</span>
                </div>
                <h4 className="font-semibold text-gray-900">Event-Driven</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Microservices communicate via events and message queues
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
