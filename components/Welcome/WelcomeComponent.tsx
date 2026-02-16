'use client';
import { PortableText } from 'next-sanity';
import s from './WelcomeComponent.module.scss'
import { portableBlockComponentsCredits } from '@/utils/portableText/portableTextCredits';

export default function WelcomeComponent() {

  return (
    <div className={s.welcome}>
      <h1>AMA</h1>
      <h2><a href="mailto:info@ama.work">info[at]ama.work</a></h2>
      {/* <PortableText
        value={project.credits}
        components={portableBlockComponentsCredits()}
      /> */}
    </div>
  )
}