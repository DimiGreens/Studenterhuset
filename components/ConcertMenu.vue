<script setup>
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
    concert: {
        type: Array,
        required: true
    }
})

const openId = ref(null)
const contentRefs = ref({})
const selectedGenre = ref('all')

const toggle = (id) => {
    openId.value = openId.value === id ? null : id
}

const filteredConcert = computed(() => {
    if (selectedGenre.value === 'all') return props.concert

    return props.concert.filter(item =>
        item.genre === selectedGenre.value
    )
})
</script>

<template>
<select v-model="selectedGenre" id="genre_selector" class="glass">
    <option value="all">All genres</option>
    <option value="pop">Pop</option>
    <option value="rock">Rock</option>
    <option value="metal">Metal</option>
</select>

<div class="concert_wrapper">
    <div
        v-for="item in filteredConcert"
        :key="item.id"
        class="concert"
    >
    <div class="band_name">
        <p>{{ item.bandName }}</p>
    </div>
        <div class="concert_image">
            <img :src="item.bandImage" alt="">

            <div class="concert_button_wrapper">
                <button
                    class="concert_button glass"
                    @click="toggle(item.id)"
                >
                    <FontAwesomeIcon :icon="faAngleDown" :class="{ rotated: openId === item.id }" />
                </button>
            </div>
        </div>

        <div class="concert_info">
            <p>{{ item.genre }}</p>
            <p>{{ item.date }}</p>
            <p>{{ item.price }},-</p>
        </div>

        <div
            :ref="el => {
                if (el) contentRefs[item.id] = el
            }"
            class="concert_content"
            :style="
                openId === item.id
                    ? {
                        maxHeight: contentRefs[item.id]?.scrollHeight + 'px',
                        paddingBottom: '20px'
                      }
                    : {
                        maxHeight: '0px',
                        paddingBottom: '0px'
                      }
            "
        >
        <p class="band_info_box">
            {{ item.bandDescription }}
        </p>
            <iframe 
            :src="`https://open.spotify.com/embed/track/${item.spotifyEmbed}`" 
            width="100%"
            height="152"
            frameborder="0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media"
            />
            <div class="button_wrapper">
                <button class="glass ticket_button">Køb billet</button>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
#genre_selector{
    color: white;
    width: 150px;
    font-size: 24px;
}

.concert{
    margin: 30px 0;
}

.band_name > p {
    font-size: 24px;
    margin: 15px 0;
}

.concert_button_wrapper{
    position: absolute;
    bottom: 10px;
    right: 10px;

    .concert_button{
        width: 50px;
        height: 50px;

        svg{
            width: 35px;
            height: 35px;
            color: white;
            transition: transform 0.3s ease;
        }
    }
}

.rotated {
  transform: rotate(180deg);
}

.concert_image{
    position: relative;

    img{
        width: 100%;
        height: 250px;
        object-position: center;
        object-fit: cover;
    }
}

.concert_info{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 18px;
    color: white;
    background-color: #5774B8;
    height: 50px;
}

.concert_content{
    overflow: hidden;
    transition: max-height .3s ease, padding .3s ease;
}

.band_info_box{
    padding: 15px 0;
}

.button_wrapper{
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
    
}

.ticket_button{
    color: white;
    font-size: 18px;
    padding: 15px;
}
</style>