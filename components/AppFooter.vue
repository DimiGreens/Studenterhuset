<script setup>
</script>

<template>
    <footer class="site_footer">
        <div class="adress">
            <p><span>Studenterhuset</span></p>
            <p>Gammeltorv 10</p>
            <p>9000 Aalborg</p>
        </div>
        <div class="contact">
            <p><span>Kontakt</span></p>
            <p>+45 31 41 04 74</p>
            <p>kontoret@studenterhuset.dk</p>
        </div>
        <div class="footer_nav">
            <p><span>Info</span></p>
            <nav class="footer_link">
                <NuxtLink to="/about">Om os</NuxtLink>
                <NuxtLink to="/student">Til studernde</NuxtLink>
                <NuxtLink to="/cafe">Caféen</NuxtLink>
                <NuxtLink to="/about">FAQ</NuxtLink>
                <NuxtLink to="/about">Kontakt</NuxtLink>
            </nav>
        </div>
    </footer>
</template>

<style scoped>
span{
    font-size: 20px;
}

.site_footer{
    background-color: #5774B8;
    padding: 15px 15px 100px 15px;

    p{
        font-size: 18px;
        color: white;
    }

    div{
        margin: 15px 0;
    }
}

.footer_link{
    display: flex;
    flex-direction: column;

    a{
        text-decoration: none;
        color: white;
        font-size: 18px;
    }
}
</style>