<script setup>
import ImageSlider from '~/components/ImageSlider.vue';

    const mySlide = [
        { id: 1, image: 'https://picsum.photos/800/400?random=1' },
        { id: 2, image: 'https://picsum.photos/800/400?random=2' },
        { id: 3, image: 'https://picsum.photos/800/400?random=3' },
        { id: 4, image: 'https://picsum.photos/800/400?random=4' },
        { id: 5, image: 'https://picsum.photos/800/400?random=5' }
    ]
</script>

<template>
    <h1>About us</h1>
    <p>This is about.vue</p>
    <div>
        <ImageSlider :slides="mySlide" />
        <p class="tester">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto repellat odio qui placeat corrupti omnis error accusamus modi autem incidunt. Sed nostrum vero quos eaque cum nulla accusamus nam eos magni ab, ipsam iusto neque iure minus consequuntur nesciunt expedita doloremque enim. Repellendus expedita nisi dolore quaerat minima architecto dolorem dolores repudiandae, provident eaque deserunt cum harum animi error tenetur voluptates eius? Impedit aspernatur quia quod cumque nihil eos laudantium a, quo amet labore explicabo, nisi, dolor praesentium vel asperiores placeat non molestias. Facere maiores autem distinctio! Soluta ex minima, inventore iure quaerat, ea, vel voluptate voluptatum nulla eaque porro.</p>
    </div>
</template>

<style scoped>
.tester{
    width: 200px;
}
</style>