<template>
    <div></div>
</template>

<script>
export default async function getToken() {
    const token = await localStorage.getItem("votegrityToken");
    return token;
}
</script>