'use client';
import s from './WelcomeComponent.module.scss'

export default function WelcomeComponent() {
  return (
    <div className={s.home}>
      <section className={s.hero}>
        <div className={s.heroNoise} />
        <div className={s.heroGlow} />
        <div className={s.heroMark} aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className={s.splitMedia}>
        <article className={s.mediaCard}>
          <div className={`${s.media} ${s.rose}`} />
        </article>
        <article className={s.mediaCard}>
          <div className={`${s.media} ${s.redWater}`} />
        </article>
      </section>

      <section className={s.statement}>
        <p>
          Honra&apos;s mission is to be a progressive luxury house responding to the significant
          questions of our time. Our creative manifesto represents our shared values and defines a
          set of principles that guide us towards progress on our key sustainability targets.
        </p>
      </section>

      <section className={s.productGrid}>
        <article className={s.productCard}>
          <div className={`${s.productImage} ${s.chairNatural}`} />
          <small>SOFT ICE INCENSE HOLDER</small>
        </article>
        <article className={s.productCard}>
          <div className={`${s.productImage} ${s.chairRed}`} />
          <small>SOFT ICE INCENSE HOLDER</small>
        </article>
      </section>

      <section className={s.textureGrid}>
        <div className={`${s.texture} ${s.metal}`} />
        <div className={`${s.texture} ${s.liquid}`} />
        <div className={`${s.texture} ${s.gold}`} />
        <div className={`${s.texture} ${s.greenFabric}`} />
      </section>

      <section className={s.columnsText}>
        <article>
          <h3>(I) GOOD OBJECTS</h3>
          <p>
            The ones you keep. Those that are made to keep. We answer that by paying close
            attention to what happens before and after an object enters your life: if it can be
            repaired, reused and integrated in daily rituals without losing value.
          </p>
        </article>
        <article>
          <h3>(II) COLLABORATIONS</h3>
          <p>
            Honra invites experts in material culture to create long-lasting pieces in limited
            editions. Each release is built with traceable processes and a clear commitment to
            conscious production and enduring quality.
          </p>
        </article>
      </section>

      <section className={s.finalVisual}>
        <div className={s.finalMark} aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </section>
    </div>
  )
}
