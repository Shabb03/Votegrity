import { createRouter, createWebHistory } from 'vue-router';
import Register from '@/views/Register.vue'
//import Login from '@/views/Login.vue'
//import Authentication from '@/views/Authentication.vue'
//import Profile from '@/views/Profile.vue'
//import Vote from '@/views/Vote.vue'
//import ResetPassword from '@/views/ResetPassword.vue'
//import ChangePassword from '@/views/ChangePassword.vue'
//import ThankYou from '@/views/ThankYou.vue'
//import Results from '@/views/Results.vue'
//import AdminLogin from '@/views/AdminLogin.vue'
//import AdminDashboard from '@/views/AdminDashboard.vue'
//import CreateElection from '@/views/CreateElection.vue'
//import AddCandidate from '@/views/AddCandidate.vue'
//import Reset from '@/views/Reset.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/register', component: Register },
        //{ path: '/login', component: Login },
        //{ path: '/authentication', component: Authentication },
        //{ path: '/profile', component: Profile },
        //{ path: '/vote', component: Vote },
        //{ path: '/resetpassword', component: ResetPassword },
        //{ path: '/changepassword', component: ChangePassword },
        //{ path: '/thankyou', component: ThankYou },
        //{ path: '/results', component: Results },
        //{ path: '/admin/login', component: AdminLogin },
        //{ path: '/admin/dashboard', component: AdminDashboard },
        //{ path: '/admin/createelection', component: CreateElection },
        //{ path: '/admin/addcandidate', component: AddCandidate },
        //{ path: '/admin/reset', component: Reset},
    ],
});

export default router;

/*
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/authentication',
            name: 'Authentication',
            component: Authentication
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile
        },
        {
            path: '/vote',
            name: 'Vote',
            component: Vote
        },
        {
            path: '/resetpassword',
            name: 'Enter Code',
            component: ResetPassword
        },
        {
            path: '/changepassword',
            name: 'Enter New Password',
            component: ChangePassword
        },
        {
            path: '/thankyou',
            name: 'Thank You',
            component: ThankYou
        },
        {
            path: '/results',
            name: 'Winner',
            component: Results
        },
        {
            path: '/admin/login',
            name: 'Admin Login',
            component: AdminLogin
        },
        {
            path: '/admin/dashboard',
            name: 'Admin Dashboard',
            component: AdminDashboard
        },
        {
            path: '/admin/createelection',
            name: 'Create Election',
            component: CreateElection
        },
        {
            path: '/admin/addcandidate',
            name: 'Add Candidate',
            component: AddCandidate
        },
        {
            path: '/admin/reset',
            name: 'Reset',
            component: Reset
        }
    ]
*/