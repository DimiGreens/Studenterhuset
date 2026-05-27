<script setup>
const myConcert = [
        { 
          id: 1, 
          bandImage: 'https://picsum.photos/800/400?random=1', 
          bandImages: ['https://picsum.photos/800/400?random=10', 'https://picsum.photos/800/400?random=11', 'https://picsum.photos/800/400?random=12'], 
          bandName: "Super Pop-band", 
          bandDescription: "Tester 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.", 
          price: 75, 
          genre: "pop", 
          date: "01/01/2026", 
          spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC"
        }, 
        { 
          id: 2, 
          bandImage: 'https://picsum.photos/800/400?random=2',
          bandImages: ['https://picsum.photos/800/400?random=13', 'https://picsum.photos/800/400?random=14', 'https://picsum.photos/800/400?random=15'],
          bandName: "Rock n' roll-band", 
          bandDescription: "Tester 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.", 
          price: 75, 
          genre: "rock", 
          date: "01/01/2026", 
          spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC" 
        }, 
        { 
          id: 3, 
          bandImage: 'https://picsum.photos/800/400?random=3',
          bandImages: ['https://picsum.photos/800/400?random=16', 'https://picsum.photos/800/400?random=17', 'https://picsum.photos/800/400?random=18'],
          bandName: "Heavy-metal-band", 
          bandDescription: "Tester 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.", 
          price: 75, 
          genre: "metal", 
          date: "01/01/2026", 
          spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC" 
        }, 
        { 
          id: 4, 
          bandImage: 'https://picsum.photos/800/400?random=4', 
          bandImages: ['https://picsum.photos/800/400?random=19', 'https://picsum.photos/800/400?random=20', 'https://picsum.photos/800/400?random=21'], 
          bandName: "Super Pop-band", 
          bandDescription: "Tester 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.", 
          price: 75, 
          genre: "pop", 
          date: "01/01/2026", 
          spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC"
        }, 
        { 
          id: 5, 
          bandImage: 'https://picsum.photos/800/400?random=5',
          bandImages: ['https://picsum.photos/800/400?random=22', 'https://picsum.photos/800/400?random=23', 'https://picsum.photos/800/400?random=24'],
          bandName: "Rock n' roll-band", 
          bandDescription: "Tester 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.", 
          price: 75, 
          genre: "rock", 
          date: "01/01/2026", 
          spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC" 
        }, 
        { 
          id: 6, 
          bandImage: 'https://picsum.photos/800/400?random=6',
          bandImages: ['https://picsum.photos/800/400?random=25', 'https://picsum.photos/800/400?random=26', 'https://picsum.photos/800/400?random=27'],
          bandName: "Heavy-metal-band", 
          bandDescription: "Tester 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ex viverra ullamcorper fermentum. In eget dapibus nunc, sed imperdiet lectus. Nulla eleifend diam ex, at dictum nibh bibendum non. Nulla id felis in justo vulputate luctus. Aenean iaculis purus ut enim feugiat rutrum. Quisque semper eu purus vel pretium. Aenean sit amet dui id enim elementum dignissim. In vitae neque in orci aliquet mollis et at eros. Nullam dictum varius ante tempor porttitor. Aliquam venenatis aliquet neque quis tincidunt. Sed sit amet blandit purus.", 
          price: 75, 
          genre: "metal", 
          date: "01/01/2026", 
          spotifyEmbed: "4uLU6hMCjMI75M1A2tKUQC" 
        }, 
    ]
</script>
<template>
  <body>
    <div class="hero_image">
      <img src="../assets/images/Studenterhuset_koncert.JPG" alt="">
    </div>
    <div class="intro-section desktop-element">
      <h1>Koncerter</h1>
      <p>
        Her i Studenterhuset har vi mange forskellige genrer og vi fungerer som vækstlag for upcoming artister, men vi ligger også hus til mere seasoned kunstnere. Der er noget for en hver smag og vi har en bred vifte af genre med artister fra hele verdenen.
      </p>
    </div>
    <ConcertMenu :concert="myConcert" />
    <div class="age-section desktop-element">
      <h2>Aldersgrænse til koncerter</h2>
      <p>
        Alle er velkommen til Studenterhusets koncerter. Hvis man er under 15, så kræver det dog at man er i selskab med en voksen. Efter kl. 24.00 skal man være over 18 år for at opholde sig i vores lokaler. Berusede personer under 18 år vil blive nægtet adgang på trods af gyldig billet.
      </p>
    </div>
    <div class="fake-section desktop-element">
      <h2>Undgå falske billetter</h2>
      <p>
        Vi har desværre set tilfælde af svindel med falske billetter, især til vores udsolgte arrangementer. For at undgå dette advarer Studenterhuset mod at købe billetter gennem uautoriserede kanaler, da dette indebærer risiko for at billetterne er falske/ugyldige. Vi anbefaler, at billetter kun købes via vores officielle salgskanaler. Studenterhuset påtager sig ikke ansvar for billetter, der er købt andre steder.
      </p>
    </div>
    <div class="two-grid-desktop desktop-element">
      <div class="cafe-section">
        <h2>Bliv frivillig</h2>
        <p>
          Studenterhuset er drevet af bl.a. frivillige, de spiller faktisk en stor rolle for os, for uden dem kunne vi ikke levere alle de fantastiske oplvelser vi er kendt for. Bliv en del af et fedt fællesskab og læs mere om hvad det vil sige at være frivillig på Studenterhuset.
        </p>
        <div class="cafe_image_wrapper">
          <img class="cafe_image" src="../assets/images/Studenterhuset_frivillig.jpg" alt="">
          <NuxtLink class="glass cafe_button" to="/cafe">Bliv Frivillig <FontAwesomeIcon :icon="faAngleRight" /></NuxtLink>
        </div>
      </div>
      <div class="newletter-section">
        <h2>Nyhedsbrev</h2>
        <p>Vil du holde dig opdateret på nyheder, koncerter og begivenheder, så tilmeld dig vores nyhedsbrev, så går du ikke glip af noget.</p>
        <div class="form_section">
          <form id="form" action="">
            <input type="text" value="Navn">
            <input type="text" value="Email">
            <input type="text" value="Telefon">
          </form>
          <img class="newspaper_image" src="../assets/images/newspaper.png" alt="">
        </div>
        <button class="glass newsletter_button">Tilmeld her <FontAwesomeIcon :icon="faAngleRight" /></button>
      </div>
    </div>
  </body>
</template>
<style scoped>
.age-section{
    margin-bottom: 30px;
}

.fake-section{
    margin-bottom: 30px;
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
      @media screen and (min-width: 992px){
  img{
      height: 50vh;
  }
  @media screen and (min-width: 1510px){
  img{
    height: 80vh;
  }
  }
}
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

.cafe_button{
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

.newsletter_button{
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

.form_section{
  display: flex;
  justify-content: center;
  align-items: center;
}

#form{
  input{
    width: 80%;
    margin: 10px;
    background-color: #D9D9D9;
    border: none;
    border-radius: 50px;
    padding: 10px;
  }
}

@media screen and (min-width: 992px) {
  .hero_image{
    margin-bottom: 30px;
  }

  .cafe_image_wrapper{
    width: 66%;
  }

  .intro-section{
    margin: 0 auto;
    width: 66%;
  }
  
  .age-section{
    margin: 0 auto;
    width: 66%;
    margin-bottom: 30px;
  }
  
  .fake-section{
    margin: 0 auto;
    width: 66%;  
    margin-bottom: 30px;
  }
  
  .cafe-section h2, .cafe-section p{
    width: 66%;
    margin: 0 auto;
  }

  .newletter-section h2, .newletter-section p{
    width: 66%;
    margin: 0 auto;
  }

  @media screen and (min-width: 1510px) {

  .desktop-element{
    margin: 50px 0;
  }

  .age-section{
    margin: 0 auto;
    width: 49%;
    margin-bottom: 30px;
  }
  
  .fake-section{
    margin: 0 auto;
    width: 49%;  
    margin-bottom: 30px;
  }

  .intro-section{
    margin: 0 auto;
    width: 49%;
  }

  .concert-section h2, .concert-section p{
    width: 49%;
    margin: 0 auto;
  }
  
  .event-section h2, .event-section p{
    width: 49%;
    margin: 0 auto;
  }
  
  .cafe-section h2, .cafe-section p{
    width: 49%;
    margin: 0 auto;
  }
  
  .newletter-section h2, .newletter-section p{
    width: 49%;
    margin: 0 auto;
  }

  .cafe_image_wrapper{
    width: 49%;
  }

  .two-grid-desktop{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    margin-inline: 100px;

    .newletter-section{
      width: 66%;
      h2, p{
        margin: 0;
      }

    }

    .cafe-section:nth-of-type(1){
      h2, p{
        width: 66%;
      }

      .cafe_image_wrapper{
        width: 66%;
      }
    }
  }
}
}
</style>