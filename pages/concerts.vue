<script setup>
const myConcert = [
        { id: 1, bandImage: 'https://picsum.photos/800/400?random=1', bandName: "Band navn", bandDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis numquam odit porro excepturi facilis earum!", price: 75, genre: "pop", date: "01/01/2026", spotifyEmbed:
      "4uLU6hMCjMI75M1A2tKUQC" }, 
        { id: 2, bandImage: 'https://picsum.photos/800/400?random=2', bandName: "Band navn", bandDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis numquam odit porro excepturi facilis earum!", price: 75, genre: "rock", date: "01/01/2026", spotifyEmbed:
      "4uLU6hMCjMI75M1A2tKUQC" }, 
        { id: 3, bandImage: 'https://picsum.photos/800/400?random=3', bandName: "Band navn", bandDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis numquam odit porro excepturi facilis earum!", price: 75, genre: "metal", date: "01/01/2026", spotifyEmbed:
      "4uLU6hMCjMI75M1A2tKUQC" }, 
    ]
</script>
<template>
    <h1>Koncerter</h1>
    <ConcertMenu :concert="myConcert" />
</template>
<style scoped></style>