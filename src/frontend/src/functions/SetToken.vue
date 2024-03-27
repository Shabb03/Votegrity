<template>
    <div></div>
</template>

<script>
//set the user's authentication token into local memory storage
export default async function setToken(token) {
    localStorage.setItem("votegrityToken", token);
}
</script>