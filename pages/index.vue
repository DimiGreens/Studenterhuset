<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const mySlides = [
  {
    id: 1,
    image: "https://picsum.photos/800/400?random=1",
    title: "Slide title",
  },
  {
    id: 2,
    image: "https://picsum.photos/800/400?random=2",
    title: "Slide title",
  },
  {
    id: 3,
    image: "https://picsum.photos/800/400?random=3",
    title: "Slide title",
  },
  {
    id: 4,
    image: "https://picsum.photos/800/400?random=4",
    title: "Slide title",
  },
];
</script>

<template>
  <div class="hero_image">
    <img src="../assets/images/Studenterhuset_forside.JPG" alt="" />
  </div>
  <div class="intro-section desktop-element">
    <img src="../assets/images/Studenterhuset_logo_sort.jpg" alt="" />
    <p>
      Velkommen til studenterhuset. I fællesskab skaber vi koncerter, debatter,
      events og aktiviteter til gavn ikke kun for studielivet, men for hele
      byen.
    </p>
    <p>
      Vi omfavner mangfoldighed og byder alle velkommen, uanset politiske
      overbevisninger, seksuelle orienteringer eller trosretninger.
    </p>
  </div>
  <div class="concert-section desktop-element">
    <h2>Koncerter</h2>
    <p>
      Studenterhuset afholder mange koncerter, i alle mulige forskellige genrer,
      så mon ikke der en til netop dig eller dig og dine venner. Gå på odagelse
      i vores kommende koncerter - vi glæder os til at se dig!
    </p>
    <ImageSlider :slides="mySlides" />
  </div>
  <div class="event-section desktop-element">
    <h2>Begivenheder</h2>
    <p>
      På Studenterhuset har vi nogle fede begivenheder som vores faste
      fredagsbar, brætspilsaften og queer night, kom ned med dine venner eller
      kom alene og bliv en del af fællesskabet.
    </p>
    <ImageSlider :slides="mySlides" />
  </div>
  <div class="cafe-section desktop-element">
    <h2>Caféen</h2>
    <p>
      Kom ned i vores hyggelige café hvor du bl.a. kan spille bordfodbold, pool
      og brætspil, du kan også bare komme og hænge ud med vennerne med en kop
      kaffe, eller måske du er mere til en eller sodavand - det er ligemeget
      hvad du er til, her er der plads til alle.
    </p>
    <div class="cafe_image_wrapper">
      <img
        class="cafe_image"
        src="../assets/images/Studenterhuset_cafe.jpg"
        alt=""
      />
      <NuxtLink class="glass cafe_button" to="/cafe"
        >Gå til caféen <FontAwesomeIcon :icon="faAngleRight"
      /></NuxtLink>
    </div>
  </div>
  <div class="two-grid-desktop desktop-element">
    <div class="cafe-section">
      <h2>Bliv frivillig</h2>
      <p>
        Studenterhuset er drevet af bl.a. frivillige, de spiller faktisk en stor
        rolle for os, for uden dem kunne vi ikke levere alle de fantastiske
        oplvelser vi er kendt for. Bliv en del af et fedt fællesskab og læs mere
        om hvad det vil sige at være frivillig på Studenterhuset.
      </p>
      <div class="cafe_image_wrapper">
        <img
          class="cafe_image"
          src="../assets/images/Studenterhuset_frivillig.jpg"
          alt=""
        />
        <NuxtLink class="glass cafe_button" to="/cafe"
          >Bliv Frivillig <FontAwesomeIcon :icon="faAngleRight"
        /></NuxtLink>
      </div>
    </div>
    <div class="newletter-section">
      <h2>Nyhedsbrev</h2>
      <p>
        Vil du holde dig opdateret på nyheder, koncerter og begivenheder, så
        tilmeld dig vores nyhedsbrev, så går du ikke glip af noget.
      </p>
      <div class="form_section">
        <form id="form" action="">
          <input type="text" value="Navn" />
          <input type="text" value="Email" />
          <input type="text" value="Telefon" />
        </form>
        <img
          class="newspaper_image"
          src="../assets/images/newspaper.png"
          alt=""
        />
      </div>
      <button class="glass newsletter_button">
        Tilmeld her <FontAwesomeIcon :icon="faAngleRight" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.cafe-section {
  margin-bottom: 15px;
}
.intro-section {
  margin: 15px 0;
  p {
    margin: 15px 0;
  }
}
.cafe_button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 60px;
  width: fit-content;
  color: white;
  padding: 0 15px;
  text-decoration: none;
  font-size: 24px;
}

.form_section {
  display: flex;
  justify-content: center;
  align-items: center;
}

#form {
  input {
    width: 80%;
    margin: 10px;
    background-color: #d9d9d9;
    border: none;
    border-radius: 50px;
    padding: 10px;
  }
}

.newsletter_button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 99;
  width: fit-content;
  padding: 0 15px;
  height: 60px;
  font-size: 24px;
  color: white;
  cursor: pointer;
  text-decoration: none;
  margin: 0 auto;
  margin-bottom: 30px;
}

.cafe_image_wrapper {
  margin: 0 auto;
  margin-top: 15px;
  position: relative;

  img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  @media screen and (min-width: 992px) {
    img {
      height: 400px;
    }
  }
}

@media screen and (min-width: 992px) {
  .cafe_image_wrapper {
    width: 66%;
  }

  .intro-section {
    margin: 0 auto;
    width: 66%;
  }

  .concert-section h2,
  .concert-section p {
    width: 66%;
    margin: 0 auto;
  }

  .event-section h2,
  .event-section p {
    width: 66%;
    margin: 0 auto;
  }

  .cafe-section h2,
  .cafe-section p {
    width: 66%;
    margin: 0 auto;
  }

  .newletter-section h2,
  .newletter-section p {
    width: 66%;
    margin: 0 auto;
  }
}

@media screen and (min-width: 1510px) {
  .desktop-element {
    margin: 50px 0;
  }

  .intro-section {
    margin: 0 auto;
    width: 49%;
  }

  .concert-section h2,
  .concert-section p {
    width: 49%;
    margin: 0 auto;
  }

  .event-section h2,
  .event-section p {
    width: 49%;
    margin: 0 auto;
  }

  .cafe-section h2,
  .cafe-section p {
    width: 49%;
    margin: 0 auto;
  }

  .newletter-section h2,
  .newletter-section p {
    width: 49%;
    margin: 0 auto;
  }

  .cafe_image_wrapper {
    width: 49%;
  }

  .two-grid-desktop {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    margin-inline: 100px;

    .newletter-section {
      width: 66%;
      h2,
      p {
        margin: 0;
      }
    }

    .cafe-section:nth-of-type(1) {
      h2,
      p {
        width: 66%;
      }

      .cafe_image_wrapper {
        width: 66%;
      }
    }
  }
}

.hero_image {
  margin: 0 -15px;

  margin-bottom: 50px;

  img {
    height: 240px;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  @media screen and (min-width: 992px) {
    img {
      height: 50vh;
    }
  }

  @media screen and (min-width: 1510px) {
    img {
      height: 80vh;
    }
  }
}
</style>
