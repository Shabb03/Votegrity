<template>
    <div></div>
</template>

<script>
export default async function getToken() {
    return localStorage.getItem("votegrityToken");
}
</script>