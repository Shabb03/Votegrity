import { createRouter, createWebHistory } from "vue-router";
import UserRegister from "@/views/UserRegister.vue";
import UserLogin from '@/views/UserLogin.vue';
import UserAuthentication from '@/views/UserAuthentication.vue';
import UserProfile from '@/views/UserProfile.vue';
import VoteCandidate from '@/views/VoteCandidate.vue';
import ChangePassword from '@/views/ChangePassword.vue';
import DeleteAccount from '@/views/DeleteAccount.vue';
import ThankYou from "@/views/ThankYou.vue";
import ElectionResults from '@/views/ElectionResults.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import CreateElection from '@/views/CreateElection.vue';
import AddCandidate from '@/views/AddCandidate.vue';
//import ResetElection from '@/views/ResetElection.vue';
import HomePage from '@/views/HomePage.vue';
import NotFound from '@/views/NotFound.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/register', component: UserRegister, name: 'Register' },
        { path: '/login', component: UserLogin, name: 'Login' },
        { path: '/authentication', component: UserAuthentication, name: 'Authentication' },
        { path: '/profile', component: UserProfile, name: 'Profile' },
        { path: '/vote', component: VoteCandidate, name: 'Vote' },
        { path: '/changepassword', component: ChangePassword, name: 'Enter New Password' },
        { path: '/deleteaccount', component: DeleteAccount, name: 'Delete Account' },
        { path: '/thankyou', component: ThankYou, name: 'Thank You For Voting' },
        { path: '/results', component: ElectionResults, name: 'Results' },
    
        { path: '/adminlogin', component: AdminLogin, name: 'Admin Login' },
        { path: '/admin/dashboard', component: AdminDashboard, name: 'Dashboard' },
        { path: '/admin/createelection', component: CreateElection, name: 'Create Election' },
        { path: '/admin/addcandidate', component: AddCandidate, name: 'Add Candidate' },
        //{ path: '/admin/reset', component: ResetElection, name: 'Reset Election' },
    
        { path: '/', component: HomePage, name: 'Loading...' },
        { path: '/:pathMatch(.*)*', component: NotFound, name: '404 Page Not Found' },
    ],
});

export default router;