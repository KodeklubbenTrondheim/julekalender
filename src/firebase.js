import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyCfokBMHl0H6d1RWl9OiPBpv1xU_sLYrGw',
  authDomain: 'kodeklubben-julekalender-980f5.firebaseapp.com',
  projectId: 'kodeklubben-julekalender-980f5',
  storageBucket: 'kodeklubben-julekalender-980f5.appspot.com',
  messagingSenderId: '643865166589',
  appId: '1:643865166589:web:5a559b6c648c207b54f494',
  measurementId: 'G-VN3EGE5CED',
}

const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp
