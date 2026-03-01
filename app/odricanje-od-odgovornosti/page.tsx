export default function DisclaimerPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Odricanje od odgovornosti</h1>
      <p className="text-gray-500 text-sm mb-8">Poslednje ažuriranje: januar 2025.</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Tačnost informacija</h2>
          <p>OutdoorBalkans.com je platforma zajednice na kojoj korisnici objavljuju informacije
          o lokacijama za outdoor aktivnosti. <strong>Sve informacije su dostavljene od strane
          korisnika</strong> i nisu proveravane od strane administracije, osim ako nije izričito
          naznačeno. Sajt ne garantuje tačnost, potpunost ni ažurnost objavljenih podataka.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. Fotografije i autorska prava</h2>
          <p>Fotografije koje korisnici objavljuju moraju biti <strong>njihova vlastita dela</strong>
          ili fotografije za koje poseduju prava korišćenja. Objavljivanjem fotografije, korisnik
          potvrđuje da ima pravo na njeno korišćenje i daje OutdoorBalkans.com neekskluzivnu licencu
          za prikazivanje. Sajt ne preuzima odgovornost za eventualne povrede autorskih prava od
          strane korisnika.</p>
          <p>Za uklanjanje fotografije koja krši autorska prava, kontaktirajte nas na:
          <strong> info@outdoorbalkans.com</strong></p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">3. Bezbednost i rizik</h2>
          <p>Outdoor aktivnosti kao što su planinarenje, lov, ribolov, kajak i kampovanje
          <strong> nose određeni stepen rizika</strong>. OutdoorBalkans.com ne preuzima odgovornost
          za povrede, štetu na imovini ili gubitak nastao usled posete lokacijama objavljenim na
          sajtu. Korisnici snose punu odgovornost za svoju bezbednost.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">4. Dozvole i propisi</h2>
          <p>Informacije o dozvolama za ribolov, lov i ulazak u zaštićena područja su
          <strong> informativnog karaktera</strong> i podložne su promenama. Korisnici su dužni
          da pre posete provere važeće propise kod nadležnih organa. Sajt ne snosi odgovornost
          za posledice neposedovanja odgovarajućih dozvola.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">5. Sadržaj zajednice</h2>
          <p>Komentari, ocene i predlozi lokacija su mišljenja korisnika i
          <strong> ne predstavljaju stavove</strong> OutdoorBalkans.com. Sajt zadržava pravo
          uklanjanja sadržaja koji krši pravila zajednice, ali ne preuzima obavezu provere
          svakog objavljenog sadržaja.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">6. Kontakt</h2>
          <p>Za prijavu nepotpunih, netačnih ili spornih informacija, kao i za pitanja vezana
          za autorska prava: <strong>info@outdoorbalkans.com</strong></p>
        </section>

      </div>
    </main>
  )
}
