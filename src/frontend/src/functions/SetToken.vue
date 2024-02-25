<template>
    <div></div>
</template>

<script>
export default async function setToken(token) {
    localStorage.setItem("votegrityToken", token);
}
</script>