import { Aside, Header, H3, Span, H5, Link, Hr, Blockquote, P, Footer, Ul, Li, H4 } from '../../mostJS/index.js';

export default function AsideComponent() {
  return Aside({className: "about"}, [
    Header({}, [
      H3({}, "MostJS TodoMVC"),
      Span({className: "source-links"}, [
      H5({}, "Source:"),
      Link({href: "https://github.com/e-aub/MostJS"},"source"),
      ]),
      Hr({}),
      Blockquote({className: "quote speech-bubble"}, [
        P({}, "The only way to get rid of an idea is to execute it."),
        Footer({className:"slide-footer"},[
          Link({href: "https://github.com/e-aub"},"@hacker_man"),
          Link({href: "https://github.com/Youssefhajjaoui"},"@Youssefhajjaoui"),
          Link({href: "https://github.com/zakariasalhi12"},"@zakariasalhi12")
        ])]),
      Hr({}),
      H4({}, "Official Ressources"),
      Ul({}, [
        Li({}, Link({href: "https://github.com/e-aub/MostJS"},"Quickstart")),
        Li({}, Link({href: "https://github.com/e-aub/MostJS"},"Documentation")),
        
      ])
    ]),
  ])
}