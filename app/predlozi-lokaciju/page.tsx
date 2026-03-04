import type { Metadata } from 'next'
import SmartProposalClient from './SmartProposalClient'

export const metadata: Metadata = {
  title: 'Predloži lokaciju | OutdoorBalkans',
  description: 'Podeli outdoor lokaciju sa zajednicom — ribolov, lov, kajak, kampovanje, planinarenje.',
}

export default function PredloziLokacijuPage() {
  return <SmartProposalClient />
}
