import {createClient, groq} from 'next-sanity'
import {apiVersion, dataset, projectId} from './env'

export const client = createClient({
    projectId: projectId,
    dataset: dataset,
    useCdn: true,
    apiVersion: apiVersion,
})