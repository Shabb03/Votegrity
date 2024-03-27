<template>
    <div></div>
</template>

<script>
//get the user's authentication token
export default async function getToken() {
    const token = await localStorage.getItem("votegrityToken");
    return token;
}
</script>