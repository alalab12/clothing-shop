<template>
  <main class="home">
    <section class="hero" :style="{ backgroundImage: `url(${nanjingImage})` }">
      <div class="hero-copy">
        <h1>Black & White. Bold & Simple.</h1>
        <div class="actions">
          <router-link to="/dresses" class="primary">Shop</router-link>
        </div>
      </div>
    </section>

    <section id="about" class="section-heading">
      <span>About us</span>
    </section>

    <section class="about">
      <article
        v-for="designer in designers"
        :key="designer.name"
        class="profile-row"
      >
        <div class="profile-media">
          <img :src="designer.image" :alt="designer.name" />
        </div>
        <div class="profile-copy">
          <p class="role">{{ designer.role }}</p>
          <h2>{{ designer.name }}</h2>
          <p>{{ designer.story }}</p>
          <small>{{ designer.focus }}</small>
        </div>
      </article>
    </section>

    <section id="contact" class="section-heading">
      <span>Contact us</span>
    </section>

    <section class="contact">
      <form class="register-card" @submit.prevent="submitRequest">
        <h1>Contact us</h1>
        <label>
          Email
          <input type="email" v-model="form.email" placeholder="Email" required />
        </label>

        <label>
          Message
          <textarea
            v-model="form.message"
            placeholder="How can we help you?"
            required
            rows="6"
          ></textarea>
        </label>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send' }}
        </button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="submitted" class="success">Message sent successfully!</p>
      </form>
    </section>
  </main>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      heroImage: require('@/img/basket.jpg'),
      nanjingImage: require('@/img/nanjing.jpg'),
      designers: [
        {
          name: 'Karys',
          role: 'Creative Director',
          story:
            'Obsessed with sculptural silhouettes and lush fabrics, she leads the overall aesthetic and editorial storytelling.',
          focus: 'Favorite fabric · washable silk',
          image: require('@/img/Karys.jpg')
        },
        {
          name: 'Meïssa',
          role: 'Technical Designer',
          story:
            'She fine-tunes every pattern and fit, ensuring size-inclusive silhouettes and seamless tailoring details.',
          focus: 'Signature detail · contour waistbands',
          image: require('@/img/Meissa.jpg')
        },
        {
          name: 'Aude',
          role: 'Experience Lead',
          story:
            'Aude curates the customer experience—from the site to packaging—so every touchpoint feels intentional.',
          focus: 'Inspiration · modern galleries and city streets',
          image: require('@/img/Aude.jpg')
        }
      ],
      form: {
        email: '',
        message: ''
      },
      submitted: false,
      loading: false,
      errorMessage: ''
    }
  },
  methods: {
    async submitRequest() {
      if (!this.form.email || !this.form.message) return

      this.errorMessage = ''
      this.loading = true

      try {
        const response = await fetch('http://localhost:3000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.form.email,
            message: this.form.message
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send message')
        }

        this.submitted = true
        this.form.email = ''
        this.form.message = ''
        setTimeout(() => {
          this.submitted = false
        }, 3000)
      } catch (error) {
        this.errorMessage = error.message || 'Failed to send message'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  background: var(--color-bg-page);
  min-height: calc(100vh - 160px);
}

.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  filter: grayscale(100%);
  margin-top: -1.5rem;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  width: 100vw;
  padding: 4rem 2rem;
}

.hero::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(249, 248, 244, 0.60);
  z-index: 0;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 400;
  color: var(--color-text-primary);
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.primary {
  border: 1px solid var(--color-text-primary);
  padding: 0.75rem 1.5rem;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-decoration: none;
  color: var(--color-bg-card);
  background: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0;
}

.primary:hover {
  background: #333;
  border-color: #333;
}

.section-heading {
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.about {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  border: 1px solid var(--color-border);
  padding: 1rem;
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
}

.profile-media img {
  width: 220px;
  height: 220px;
  object-fit: cover;
  filter: grayscale(100%);
  border-radius: var(--radius-md);
}

.profile-copy {
  flex: 1 1 240px;
}

.profile-copy h2 {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--color-text-primary);
}

.profile-copy p {
  margin: 0 0 0.5rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.profile-copy .role {
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
}

.profile-copy small {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.contact {
  display: flex;
  justify-content: center;
}

.register-card {
  width: min(640px, 100%);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 3rem;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-card h1 {
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--color-text-primary);
}

.register-card label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.register-card input,
.register-card textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  transition: border-color 0.2s ease;
}

.register-card input:focus,
.register-card textarea:focus {
  outline: none;
  border-color: var(--color-text-primary);
}

.register-card button {
  background: var(--color-text-primary);
  color: var(--color-bg-card);
  border: none;
  padding: 0.95rem;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.18s ease;
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 0.5rem;
}

.register-card button:hover:not(:disabled) {
  background: #2a2a2a;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.register-card button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  color: #1e6b3e;
  font-weight: var(--font-weight-medium);
  margin: 0.8rem 0 0;
  padding: 0.85rem 1.1rem;
  background: #f0f9f4;
  border: 1px solid #c3e6cd;
  border-radius: 3px;
  font-size: 0.92rem;
  letter-spacing: 0.01em;
}

.error {
  color: #111;
  margin: 0;
}

@media (max-width: 640px) {
  .profile-media img {
    width: 100%;
    height: auto;
  }

  .register-card {
    padding: 2.25rem 1.75rem;
  }
}
</style>
