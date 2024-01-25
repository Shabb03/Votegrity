import { createRouter, createWebHistory } from 'vue-router';
import UserRegister from '@/views/UserRegister.vue'
//import UserLogin from '@/views/UserLogin.vue'
//import UserAuthentication from '@/views/UserAuthentication.vue'
//import UserProfile from '@/views/UserProfile.vue'
//import VoteCandidate from '@/views/VoteCandidate.vue'
//import ResetPassword from '@/views/ResetPassword.vue'
//import ChangePassword from '@/views/ChangePassword.vue'
//import ThankYou from '@/views/ThankYou.vue'
//import ElectionResults from '@/views/ElectionResults.vue'
//import AdminLogin from '@/views/AdminLogin.vue'
//import AdminDashboard from '@/views/AdminDashboard.vue'
//import CreateElection from '@/views/CreateElection.vue'
//import AddCandidate from '@/views/AddCandidate.vue'
//import ResetElection from '@/views/ResetElection.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/register', component: UserRegister, name: 'Register' },
        //{ path: '/login', component: UserLogin, name: 'Login' },
        //{ path: '/authentication', component: UserAuthentication, name: 'Authentication' },
        //{ path: '/profile', component: UserProfile, name: 'Profile' },
        //{ path: '/vote', component: VoteCandidate, name: 'Vote' },
        //{ path: '/resetpassword', component: ResetPassword, name: 'Enter Code' },
        //{ path: '/changepassword', component: ChangePassword, name: 'Enter New Password' },
        //{ path: '/thankyou', component: ThankYou, name: 'Thank You' },
        //{ path: '/results', component: ElectionResults, name: 'Results' },
        //{ path: '/admin/login', component: AdminLogin, name: 'Login' },
        //{ path: '/admin/dashboard', component: AdminDashboard, name: 'Dashboard' },
        //{ path: '/admin/createelection', component: CreateElection, name: 'Create Election' },
        //{ path: '/admin/addcandidate', component: AddCandidate, name: 'Add Candidate' },
        //{ path: '/admin/reset', component: ResetElection, name: 'Reset Election' },
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