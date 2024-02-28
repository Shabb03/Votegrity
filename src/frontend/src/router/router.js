import { createRouter, createWebHistory } from "vue-router";

import UserLogin from '@/views/UserLogin.vue';
import UserRegister from "@/views/UserRegister.vue";
import UserAuthentication from '@/views/UserAuthentication.vue';
import UserProfile from '@/views/UserProfile.vue';
import VoteCandidate from '@/views/VoteCandidate.vue';
import ChangePassword from '@/views/ChangePassword.vue';
import DeleteAccount from '@/views/DeleteAccount.vue';
import ThankYou from "@/views/ThankYou.vue";
import ElectionResults from '@/views/ElectionResults.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import CreateElection from '@/views/CreateElection.vue';
import AddCandidate from '@/views/AddCandidate.vue';
import PublishResults from '@/views/PublishResults.vue';
import HomePage from '@/views/HomePage.vue';
import NotFound from '@/views/NotFound.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', component: UserLogin, name: 'Login' },

        { path: '/register', component: UserRegister, name: 'Register' },
        { path: '/authentication', component: UserAuthentication, name: 'Authentication' },
        { path: '/profile', component: UserProfile, name: 'Profile' },
        { path: '/vote', component: VoteCandidate, name: 'Vote' },
        { path: '/changepassword', component: ChangePassword, name: 'Enter New Password' },
        { path: '/deleteaccount', component: DeleteAccount, name: 'Delete Account' },
        { path: '/thankyou', component: ThankYou, name: 'Thank You For Voting' },
        { path: '/results', component: ElectionResults, name: 'Results' },
    
        { path: '/admin/dashboard', component: AdminDashboard, name: 'Dashboard' },
        { path: '/admin/createelection', component: CreateElection, name: 'Create Election' },
        { path: '/admin/addcandidate', component: AddCandidate, name: 'Add Candidate' },
        { path: '/admin/publishresults', component: PublishResults, name: 'Publish Results' },
    
        { path: '/', component: HomePage, name: 'Loading...' },
        { path: '/:pathMatch(.*)*', component: NotFound, name: '404 Page Not Found' },
    ],
});

export default router;