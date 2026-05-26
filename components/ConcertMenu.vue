<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
    concert: {
        type: Array,
        required: true
    }
})

const openId = ref(null)
const contentRefs = ref({})
const selectedGenre = ref('all')
const selectedConcert = ref(null)

const toggle = (id) => {
    openId.value = openId.value === id ? null : id
}

const filteredConcert = computed(() => {
    if (selectedGenre.value === 'all') return props.concert

    return props.concert.filter(item =>
        item.genre === selectedGenre.value
    )
})

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const onResize = () => windowWidth.value = window.innerWidth

onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
const isDesktop = computed(() => windowWidth.value > 992)

const openModal = (item) => selectedConcert.value = item
const closeModal = () => selectedConcert.value = null

const otherConcerts = computed(() => 
    props.concert.filter(item => item.id !== selectedConcert.value?.id)
)
</script>

<template>
<select v-model="selectedGenre" id="genre_selector" class="glass">
    <option value="all">All genres</option>
    <option value="pop">Pop</option>
    <option value="rock">Rock</option>
    <option value="metal">Metal</option>
</select>

<div v-if="!isDesktop" class="concert_wrapper">
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

<div v-if="isDesktop" class="concert_wrapper">
    <div
        v-for="item in filteredConcert"
        :key="item.id"
        class="concert"
        @click="openModal(item)"
    >
    <div class="band_name">
        <p>{{ item.bandName }}</p>
    </div>
        <div class="concert_image">
            <img :src="item.bandImage" alt="">
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

    <Teleport to="body">
        <Transition name="modal">
            <div v-if="selectedConcert" class="modal_backdrop" @click.self="closeModal">
                <div class="modal_container">
                    <div class="modal">
                        <div class="image_wrapper">
                            <button class="modal_close glass" @click="closeModal">✕</button>
                            <img :src="selectedConcert.bandImage" alt="" class="modal_image" />
                        </div>
                        <div class="opened_modal_bandbox">
                            <div class="band_detail">
                                <h2>{{ selectedConcert.bandName }}</h2>
                                <p class="band_info_box">{{ selectedConcert.bandDescription }}</p>
                                <iframe
                                :src="`https://open.spotify.com/embed/track/${selectedConcert.spotifyEmbed}`"
                                width="100%" height="152" frameborder="0" loading="lazy"
                                allow="autoplay; clipboard-write; encrypted-media"
                                />
                            </div>
                            <div class="concert_info">
                                <p>{{ selectedConcert.genre }}</p>
                                <p>{{ selectedConcert.date }}</p>
                                <p>{{ selectedConcert.price }},-</p>
                                <div class="button_wrapper">
                                    <button class="glass ticket_button">Køb billet</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal_sidebar">
                        <h3>Andre koncerter</h3>
                        <div
                        v-for="item in otherConcerts"
                        :key="item.id"
                        class="sidebar_concert"
                        @click="openModal(item)"
                        >
                            <img :src="item.bandImage">
                            <div class="sidebar_overlay">
                                <span class="glass">{{ item.bandName }} <FontAwesomeIcon :icon="faAngleRight" class="sidebar_icon" /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
</Teleport>
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
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.3s ease;
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

.modal_backdrop{
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
.modal_container {
    display: flex;
    gap: 15px;
    max-height: 85vh;
    width: min(1400px, 95vw);
}

.modal {
    flex: 1;
}

.modal_sidebar {
    width: 220px;
    overflow-y: auto;
    flex-shrink: 0;

    h3 {
        color: white;
        margin-bottom: 15px;
    }
}

.sidebar_concert {
    position: relative;
    cursor: pointer;
    margin-bottom: 10px;

    img {
        width: 100%;
        height: 130px;
        object-fit: cover;
        display: block;
    }

    .sidebar_overlay {
        position: absolute;
        bottom: 10px;
        left: 10px;
    }

    span {
    color: white;
    font-size: 14px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 0px;
    border-radius: 20px;
    transition: gap 0.2s ease;
}

.sidebar_icon {
    width: 14px;
    height: 14px;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-width 0.2s ease, opacity 0.2s ease;
}

&:hover span {
    gap: 6px;
}

&:hover .sidebar_icon {
    max-width: 14px;
    opacity: 1;
}
}

.modal_image{
    display: block;
    width: 100%;
    height: 400px;
    object-fit: cover;
    object-position: center;
}

.image_wrapper {
    position: relative;
    overflow: visible;
}

.modal_close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    color: white;
    font-size: 18px;
    cursor: pointer;
    z-index: 10;
}

.opened_modal_bandbox{
    display: flex;
    align-items: stretch;

    .band_detail{
        background-color: white;
        padding: 30px;
        flex: 1;
    }

    .concert_info{
        padding: 30px;
        flex-direction: column;
        justify-content: space-between;
        height: auto;
        min-width: 180px;
    }
}

.rotated {
  transform: rotate(180deg);
}

.concert_image{
    position: relative;
    overflow: hidden;

    img{
        width: 100%;
        height: 250px;
        object-position: center;
        object-fit: cover;
        transition: transform 0.3s ease;
        display: block;
    }
}

.concert:hover .concert_image img {
    transform: scale(1.1);
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

.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }

@media screen and (min-width: 992px){
    .concert_wrapper{
        margin-inline: 100px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
    }
}

@media screen and (min-width: 1510px){
    .concert_wrapper{
        margin-inline: 150px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
    }
}
</style>