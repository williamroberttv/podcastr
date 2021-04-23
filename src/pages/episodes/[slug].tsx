import { GetStaticPaths, GetStaticProps } from "next";
import Link from 'next/link';
import Image from 'next/image'
import {format, parseISO} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import {api} from '../../services/api'
import {convertDurationToTimeString} from '../../utils/convertDurationToTimeString'

import styles from './episodes.module.scss'

type Episodes={
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: number;
  url: string;
  publishedAt: string;
  description: string;
}

type EpisodesProps = {
  episode: Episodes;
}

export default function Episode({ episode }: EpisodesProps){
  return(
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <button>
          <Link href="/">
            <img src="/arrow-left.svg" alt="Voltar"/>
          </Link>
        </button>
        <Image
        width={700}
        height={160}
        src={episode.thumbnail}
        objectFit="cover"/>
        <button>
          <img src="/play.svg" alt="Tocar episódio"/>
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
        </header>

        <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}}/>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return{
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) =>{
  const {slug} = ctx.params

  const {data} = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)) ,
    url: data.file.url,
    description: data.description
  };

  return{
    props:{
      episode,
    },
    revalidate: 60 * 60 * 24,
  }
}