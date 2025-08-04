// Test script for login functionality
// Run this with: node test-login.js

const axios = require('axios');

const BASE_URL = 'http://49.13.105.38:8080';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  avatar: {
    public_id: 'test_avatar',
    url: 'https://example.com/avatar.jpg',
    secure_url: 'https://example.com/avatar.jpg',
  },
};

async function createTestUser() {
  try {
    console.log('Creating test user...');
    const response = await axios.post(`${BASE_URL}/user/createUser`, testUser);
    console.log('✅ Test user created successfully:', response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️  Test user already exists');
      return null;
    }
    console.error('❌ Error creating test user:', error.response?.data || error.message);
    throw error;
  }
}

async function testLogin() {
  try {
    console.log('\nTesting login...');
    const loginData = {
      email: testUser.email,
      password: testUser.password,
    };

    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Login successful!');
    console.log('Response:', {
      user: response.data.user,
      access_token: response.data.access_token ? '***TOKEN***' : 'No token',
    });

    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testAuthRoute(accessToken) {
  try {
    console.log('\nTesting authenticated route...');
    const response = await axios.get(`${BASE_URL}/auth/test`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('✅ Authenticated route successful:', response.data);
  } catch (error) {
    console.error('❌ Authenticated route failed:', error.response?.data || error.message);
  }
}

async function runTests() {
  try {
    console.log('🚀 Starting login tests...\n');

    // Create test user
    await createTestUser();

    // Test login
    const loginResult = await testLogin();

    // Test authenticated route
    if (loginResult.access_token) {
      await testAuthRoute(loginResult.access_token);
    }

    console.log('\n🎉 All tests completed!');
    console.log(
      '\nYou can now test the login in your backoffice at: http://localhost:3001/auth/jwt/sign-in'
    );
    console.log('Use these credentials:');
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
  }
}

// Run the tests
runTests();
