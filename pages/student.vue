<script setup>
    const myAccordion = [
        { id: 1, accordionTitle: "Hvad er Studenterhuset?", accordionContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis numquam odit porro excepturi facilis earum!" },
        { id: 2, accordionTitle: "Hvilket musikgenre er der?", accordionContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis numquam odit porro excepturi facilis earum!" },
        { id: 3, accordionTitle: "Hvilket udstyr er til rådighed?", accordionContent: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione quasi veniam, impedit optio non molestias accusantium corrupti molestiae totam aut quo necessitatibus labore ducimus aspernatur deserunt omnis ut repudiandae. Hic fugit sint doloremque laboriosam quod qui vero nostrum sit ab! Odit dolorem tenetur error ex, nesciunt vitae culpa et quas consequuntur, qui molestias atque a. Voluptates ullam suscipit sequi ad reiciendis, laudantium porro ratione quaerat enim? Totam ratione aspernatur neque doloremque corporis, similique minima incidunt odit vel reprehenderit perferendis dignissimos alias necessitatibus rerum, aliquam ad soluta. Inventore culpa in maxime vel quos explicabo fuga architecto esse, voluptatibus laboriosam beatae non. Adipisci officia pariatur tempora vero impedit voluptatem obcaecati modi, beatae rerum quidem consequuntur inventore deleniti odit accusantium provident doloribus fugiat quia hic quos quasi cum! Accusamus totam labore praesentium nulla. Ducimus, est ad! Molestias, quo blanditiis ut ipsa enim perferendis voluptatum illo accusantium? Dolorem, veritatis ad delectus veniam nesciunt asperiores." },
    ]
</script>
<template>
    <Accordion :accordion="myAccordion" />
</template>
<style scoped></style>