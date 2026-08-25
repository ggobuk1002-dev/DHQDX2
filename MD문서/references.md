\# 출처 및 에셋 코드 규칙  
\- 콘텐츠에서 사용하는 참고문헌과 에셋은 해당 R 또는 A 코드로 표시한다.  
\- R/A 코드는 개별 문장이나 세부 요소가 아닌 콘텐츠 단위로 연결할 수 있다.  
\- 콘텐츠에 연결된 R/A 코드는 해당 콘텐츠에서 사용된 자료 전체를 의미하며, 개별 자료가 어느 문장이나 요소에 사용되었는지 별도로 기록하지 않는다.  
\- \`references.md\`는 R/A 코드와 실제 참고문헌 및 에셋 정보의 원장(master)으로 사용한다.  
\- 다른 콘텐츠 문서에서는 실제 서지정보나 에셋 정보를 반복해서 작성하지 않고 R/A 코드만 참조한다.

\#\# 코드 체계

\- \[R01\], \[R02\], \[R03\] ...  
  \- Reference  
  \- 학술 논문, 전문서적, 기관 자료 등 과학적 정보의 출처

\- \[A01\], \[A02\], \[A03\] ...  
  \- Asset  
  \- 이미지, 3D 모델, 영상 등 전시에 사용하는 에셋의 출처 및 정보

\#\# 기본 규칙

\- R과 A는 서로 독립적으로 번호를 부여한다.  
\- R은 과학적 참고문헌(Reference), A는 전시 에셋(Asset)을 의미한다.  
\- R과 A의 코드는 전체 프로젝트에서 고유하게 관리한다.  
\- 동일한 자료를 여러 콘텐츠에서 사용하는 경우 동일한 코드를 사용한다.  
\- 기존에 부여된 코드는 임의로 변경하지 않는다.  
\- 새로운 자료를 추가할 경우 기존 번호 다음 번호를 부여한다.  
\- AI는 사용자가 제공하지 않은 출처나 에셋 정보를 임의로 생성하지 않는다.  
\- 서지정보나 에셋 정보가 불완전한 경우 확인되지 않은 정보를 추정하여 작성하지 않는다.

\#\# 정리 규칙

\- 원자료 목록을 기준으로 참고문헌과 에셋의 형식을 통일한다.  
\- 참고문헌은 저자명, 연도, 제목, 학술지/출판사, 권(호), 페이지, DOI 등의 정보를 가능한 범위에서 정리한다.  
\- 원자료에 없는 서지정보를 임의로 생성하지 않는다.  
\- 동일한 자료가 중복되어 있는 경우 하나로 통합한다.  
\- 자료의 종류에 따라 단행본, 논문, 기관 자료, 에셋 등으로 분류할 수 있다.  
\- 정리된 참고문헌에는 \[R01\], \[R02\], \[R03\]과 같은 고유 코드를 부여한다.  
\- 정리된 에셋에는 \[A01\], \[A02\], \[A03\]과 같은 고유 코드를 부여한다.  
\- R과 A는 서로 별도의 번호 체계를 사용한다.  
\- 콘텐츠에서 사용하는 자료에는 해당 R 또는 A 코드를 인용한다.  
\- 콘텐츠 작성 시 출처가 명확하게 확인되는 경우에만 해당 코드를 연결한다.  
\- 출처와 콘텐츠의 대응 관계가 불명확한 경우 AI가 임의로 출처를 연결하지 않는다.

\#\# 원자료 처리 규칙

\- 원자료 목록에 포함된 자료는 임의로 삭제하지 않는다.  
\- 원자료의 서지정보가 불완전한 경우, 확인 가능한 정보만 정리하고 누락된 정보는 그대로 둔다.  
\- 원자료에 존재하지 않는 저자, 연도, 제목, 학술지, 페이지, DOI 등의 정보를 추정하여 추가하지 않는다.  
\- 동일 자료의 중복 여부가 확실하지 않은 경우 임의로 통합하지 않는다.  
\- 원자료에 기록된 정보와 외부에서 확인한 정보가 서로 다른 경우, 원자료를 임의로 덮어쓰지 않고 차이를 확인한다.

\#\# 코드 부여 예시

\[R01\] 첫 번째 과학 참고문헌  
\[R02\] 두 번째 과학 참고문헌  
\[R03\] 세 번째 과학 참고문헌

\[A01\] 첫 번째 전시 에셋  
\[A02\] 두 번째 전시 에셋  
\[A03\] 세 번째 전시 에셋

\#\# 표기 예시

\- 과학 정보: \[R01\], \[R02\]  
\- 3D 에셋: \[A01\]  
\- 이미지: \[A02\]  
\- 영상: \[A03\]

\#\# 참고문헌

\[R01\] Author, A. A. (Year). Title. Journal.

\[R02\] Author, B. B. (Year). Title. Journal.

\#\# 에셋

\[A01\] 제작자. (Year). Asset Name. Platform. License. URL.

\[A02\] 기관명. (Year). Image Name. URL.

# \#\#\# 공통

1\. 단행본

\- 반즈, 사이먼. (2023). 『100가지 동물로 읽는 세계사: 티라노사우루스부터 북극곰까지 인류와 공생한 동물들의 이야기』. 오수원 옮김. 서울: 현대지성.

\- 애슈비, 잭. (2026). 『자연사박물관이 세계를 구하는 법: 대멸종의 시대, 자연의 기억보관소가 들려주는 전시실 너머의 이야기』. 제효영 옮김. 서울: 김영사.

\- 케이시언, 퍼트리샤 오노니우. (2026). 『자연은 퀴어하다: 장소에 토박이가 된다는 것, 속한다는 것, 그리고 자연의 온갖 퀴어함에 관하여』. 노승영 옮김. 서울: 에이도스.

\- Grant, P. R., & Grant, B. R. (2008). How and Why Species Multiply: The Radiation of Darwin's Finches. Princeton University Press.

\- Odling-Smee, F. J., Laland, K. N., & Feldman, M. W. (2003). Niche Construction: The Neglected Process in Evolution. Princeton University Press.

\- Schluter, D. (2000). The Ecology of Adaptive Radiation. Oxford University Press.

\- Foth, C., & Rauhut, O. W. M. (eds.). (2020). The Evolution of Feathers: From Their Origin to the Present. Springer.

\- Taylor, W. T. (2024). Hoof Beats: How Horses Shaped Human History. University of California Press.

2\. 진화·생태·행동

\- Van Valen, L. (1973). A new evolutionary law. Evolutionary Theory, 1, 1–30.

\- Dunbar, R. I. M. (2009). The social brain hypothesis and its implications for social evolution. Annals of Human Biology, 36(5), 562–572. https://doi.org/10.1080/03014460902960289.

\- West, P. M., & Packer, C. (2002). Sexual selection, temperature, and the lion's mane. Science, 297(5585), 1339–1343. https://doi.org/10.1126/science.1073257.

\- Kruuk, H. (1972). Surplus killing by carnivores. Journal of Zoology, 166(2), 233–244. https://doi.org/10.1111/j.1469-7998.1972.tb04087.x.

\- Lemaître, J.-F., et al. (2018). The influence of early-life allocation to antlers on male performance during adulthood: Evidence from contrasted populations of a large herbivore. Journal of Animal Ecology. https://doi.org/10.1111/1365-2656.12833.

\- Shubin, N. H., Daeschler, E. B., & Jenkins, F. A. Jr. (2006). The pectoral fin of Tiktaalik roseae and the origin of the tetrapod limb. Nature, 440, 764–771. https://doi.org/10.1038/nature04637.

\- Xu, X., et al. (2013). The genetic basis of white tigers. Current Biology, 23(11), 1031–1035. https://doi.org/10.1016/j.cub.2013.04.054.

\- Pieau, C., Dorizzi, M., & Richard-Mercier, N. (1999). Temperature-dependent sex determination and gonadal differentiation in reptiles. Cellular and Molecular Life Sciences, 55, 887–900.

\- Falconer, D. S. (1944). White plumage of sea-birds. Nature, 153, 777\. https://doi.org/10.1038/153777a0.

3\. 한국·백제·문화유산

\- 김건희. (2013). 고구려 벽화와 백제 금동대향로를 통한 내세관의 비교 고찰—강서대묘·강서중묘와 금동대향로의 도상 및 구조해석 중심으로. 『한국학논집』, 52, 219–248. https://doi.org/10.18399/actako.2013..52.008.

\- 국립부여박물관. (2026). 「백제대향로관」. 국립부여박물관.

\- 한국학중앙연구원. (2026). 「백제금동대향로」. 『한국민족문화대백과사전』.

\- Lee, S.-R., Kim, Y.-B., & Lee, T.-S. (2019). The first molecular evidence of Korean Zalophus japonicus (Otariidae: Sea Lions) from the archaeological site of Dokdo Island, Korea. Ocean Science Journal, 54(3), 497–501. https://doi.org/10.1007/s12601-019-0019-5.

\- Ito, T., Lee, Y.-J., Nishimura, T. D., Tanaka, M., Woo, J.-Y., & Takai, M. (2018). Phylogenetic relationship of a fossil macaque (Macaca cf. robusta) from the Korean Peninsula to extant species of macaques based on zygomaxillary morphology. Journal of Human Evolution, 119, 1–13. https://doi.org/10.1016/j.jhevol.2018.02.002.

\- Kim, J., Blazyte, A., Choi, J.-P., et al. (2025). Dokdo sea lion Zalophus japonicus genome reveals its evolutionary trajectory before extinction. BMC Biology, 23, 234\.

# \#\#\# 1\. 말

\-문헌  
MacFadden, B. J. (2005). Evolution. Fossil horses—evidence for evolution.  
Rebay-Salisbury, K. (2018). Horses, Wagons, and Chariots.

Kanne, K. (2022). Riding, Ruling, and Resistance: Equestrianism and Political Authority in the Hungarian Bronze Age.

Librado, P. et al. (2021). The origins and spread of domestic horses from the Western Eurasian steppes.

Al Jassim, R. A. M. & Andrews, F. M. (2009). The Bacterial Community of the Horse Gastrointestinal Tract and Its Relation to Fermentative Acidosis, Laminitis, Colic, and Stomach Ulcers.

Imhof, U. (2010). Die Geschichte des Hufbeschlags.

War Horses and the Stirrup Thesis.

\-과학해설  
단행본  
Taylor, W. T. (2024). Hoof Beats: How Horses Shaped Human History. University of California Press.

진화·형태  
McHorse, B. K., Biewener, A. A., & Pierce, S. E. (2019). The Evolution of a Single Toe in Horses: Causes, Consequences, and the Way Forward. Integrative and Comparative Biology, 59(3), 638–655. https://doi.org/10.1093/icb/icz050.

Solounias, N., et al. (2018). The evolution and anatomy of the horse manus with an emphasis on digit reduction. Royal Society Open Science, 5\. https://doi.org/10.1098/rsos.171782.

McHorse, B. K., Biewener, A. A., & Pierce, S. E. (2017). Mechanics of evolutionary digit reduction in fossil horses (Equidae). Proceedings of the Royal Society B: Biological Sciences, 284(1861), 20171174\. https://doi.org/10.1098/rspb.2017.1174.

Morales-García, N. M., et al. (2023). Hipparion tracks and horses' toes: the evolution of the equid single hoof. Journal of Anatomy.

인간과 말  
Kyselý, R., & Peške, L. (2022). New discoveries change existing views on the domestication of the horse and specify its role in human prehistory and history – a review. Archeologické rozhledy. https://doi.org/10.35686/AR.2022.15.

기승 기술  
Li, Y. (2023). Further discussion on the origins of horse stirrups. Chinese Archaeology, 23(1), 169–177. https://doi.org/10.1515/char-2023-0012.

편자  
Imhof, U. (2004). Chronology of horseshoes found in Switzerland. Schweizer Archiv für Tierheilkunde, 146(1), 17–21, 21–25. https://doi.org/10.1024/0036-7281.146.1.

Potts, D. T. (2023). The Antiquity and Nature of Horseshoeing in Iran. Iranica Antiqua, 58, 243–280. [https://doi.org/10.2143/IA.58.0.3292999](https://doi.org/10.2143/IA.58.0.3292999).

\-3D에셋  
국가유산 디지털 서비스. 「서라벌\_천년왕경\_말」. 공공누리 제1유형(출처표시).   
https://digital.khs.go.kr/record/recordDetail3D.do?ichDataUid=13936867936769100228\&bizId=BIZ202300050001\&orderCdList=B\&pageSe=3D\&searchText=%25EB%25A7%2590\&checkbox=false\&searchClick=N

# \#\#\# 2\. 호랑이

\-문헌  
백호의 유전, 열성 형질, SLC45A2, 근친교배  
Xu, X. et al. (2013). The Genetic Basis of White Tigers. Current Biology, 23(11), 1031–1035. DOI: 10.1016/j.cub.2013.04.054.

한반도 호랑이 감소, 포획, 농업 확대, 서식지 파괴  
Seeley, J. & Skabelund, A. (2015). Tigers—Real and Imagined—in Korea’s Physical and   
Cultural Landscape. Environmental History, 20(3), 475–492. DOI: 10.1093/envhis/emv079.

일제강점기 호랑이 포획·해수구제정책  
신진숙 (2017). 「호랑이 사냥을 통해 본 식민지 경관의 생산 방식 고찰」. 동아시아문화연구, 69, 91–123. DOI: 10.16959/jeachy..69.201705.91.

조선 전기 한반도의 Panthera 분포·서식지  
Kim et al. (2025). Estimating the 15th-Century Potential Habitats of Endangered Mammals on the Korean Peninsula: Implications for Restoration. Ecology and Evolution. DOI: 10.1002/ece3.71676.

\-3D에셋  
국가유산 디지털 서비스. 「서라벌\_천년왕경\_호랑이」. 공공누리 제1유형(출처표시).   
https://digital.khs.go.kr/record/recordDetail3D.do?ichDataUid=13936867937885100373\&bizId=BIZ202300050001\&orderCdList=M\&orderCdList=M\&pageSe=3D\&searchText=%25EC%2584%259C%25EB%259D%25BC%25EB%25B2%258C%2520%25ED%2598%25B8%25EB%259E%2591%25EC%259D%25B4\&checkbox=false\&searchClick=N

# \#\#\# 3\. 사자

\-문헌  
사자 갈기, 성선택, 수컷의 상태 신호  
 West, P. M. & Packer, C. (2002). Sexual Selection, Temperature, and the Lion's Mane. Science, 297(5585), 1339–1343. DOI: 10.1126/science.1073257.

사자의 문제 해결, 학습, 기억, 사회적 지능 가설  
 Borrego, N. & Dowling, B. (2016). Lions (Panthera leo) solve, learn, and remember a novel resource acquisition problem. Animal Cognition, 19(5), 1019–1025. DOI: 10.1007/s10071-016-1009-y.

동굴사자의 분포, 한반도 출현  
 Puzachenko, A. Yu. et al. (2024). Distribution history of the cave lion (Panthera spelaea (Goldfuss, 1810)). Earth History and Biodiversity, 1, 100006\. DOI: 10.1016/j.hisbio.2024.100006.

사자 새끼 돌봄, 무리 생활  
 Smithsonian's National Zoo. Lion.  
 → 사자의 사회생활과 번식·새끼 돌봄에 관한 자료.

\-3D에셋  
https://skfb.ly/KCBU

# \#\#\# 4\. 족제비

\-문헌  
족제비의 신체 형태와 소형 포식자로서의 생태  
King, C. M. (1980). The weasel Mustela nivalis and its prey in an English woodland. Journal of Animal Ecology, 49(1), 127–159.

족제비의 식성과 소형 설치류 포식  
McDonald, R. A., Webbon, C., & Harris, S. (2000). The diet of stoats (Mustela erminea) and weasels (Mustela nivalis) in Great Britain. Journal of Zoology, 252(3), 363–371. DOI: 10.1111/j.1469-7998.2000.tb00631.x.

생태적 니치(niche)의 개념  
Hutchinson, G. E. (1957). Concluding remarks. Cold Spring Harbor Symposia on Quantitative Biology, 22, 415–427. DOI: 10.1101/SQB.1957.022.01.039.

니치 개념의 현대적 해석과 생태적 지위  
Holt, R. D. (2020). Niche breadth: Causes and consequences for ecology, evolution, and conservation. The Quarterly Review of Biology, 95(3), 179–214. DOI: 10.1086/710388.

\-3D에셋  
[https://skfb.ly/oKByZ](https://skfb.ly/oKByZ)  
[https://skfb.ly/oEAwv](https://skfb.ly/oEAwv)

# \#\#\# 5\. 원숭이

\-문헌  
영장류의 손·발 구조와 파지 능력  
Napier, J. R. & Napier, P. H. (1967). A Handbook of Living Primates: Morphology, Ecology and Behaviour of Nonhuman Primates. Academic Press.

인간과 다른 영장류의 진화적 관계  
Cartmill, M. & Smith, F. H. (2011). The Human Lineage. Wiley-Blackwell.

영장류의 번식 행동과 성적 신호  
Dixson, A. F. (2012). Primate Sexuality: Comparative Studies of the Prosimians, Monkeys, Apes, and Humans. Oxford University Press.

한반도 플라이스토세 마카크류 화석의 계통적 관계  
Ito, T., Lee, Y.-J., Nishimura, T. D., Tanaka, M., Woo, J.-Y. & Takai, M. (2018). Phylogenetic relationship of a fossil macaque (Macaca cf. robusta) from the Korean Peninsula to extant species of macaques based on zygomaxillary morphology. Journal of Human Evolution, 119, 1–13.

북한 플라이스토세 마카크류 화석과 당시 환경  
Han, K. S., So, K. S., Ri, J. N., Ri, P., Chol, U. & Kang, J. G. (2023). Macaque fossils (Cercopithecidae: Papionini) from the Kumok Cave, Sungho County, North Hwanghae Province, the Democratic People's Republic of Korea. Journal of Quaternary Science, 38(5), 719–724.

\-3D에셋  
https://skfb.ly/pMuOH

# \#\#\# 6\. 사슴

\-문헌

사슴뿔의 재생과 성장

Li, C. & Suttie, J. M. (2012). Morphogenetic aspects of deer antler development. Frontiers in Bioscience (Elite Edition), 4(5), 1836–1842. DOI: 10.2741/505.

Feleke, M., Bennett, S., Chen, J., Hu, X., Williams, D. & Xu, J. (2020). New physiological insights into the phenomena of deer antler: A unique model for skeletal tissue regeneration. Journal of Orthopaedic Translation, 27, 57–66. DOI: 10.1016/j.jot.2020.10.012.

Li, C. (2023). Deer antler renewal gives insights into mammalian epimorphic regeneration. Cell Regeneration, 12, 26\.

사슴뿔과 성선택

Kruuk, L. E. B., Slate, J., Pemberton, J. M., Brotherstone, S., Guinness, F. & Clutton-Brock, T. H. (2002). Antler size in red deer: heritability and selection but no evolution. Evolution, 56(8), 1683–1695. DOI: 10.1111/j.0014-3820.2002.tb01480.x.

Clements, M. N., Clutton-Brock, T. H., Albon, S. D., Pemberton, J. M. & Kruuk, L. E. B. (2010). Getting the timing right: antler growth phenology and sexual selection in a wild red deer population. Oecologia, 164(2), 357–368. DOI: 10.1007/s00442-010-1656-7.

뿔의 크기와 비용·절충

Reglero, M. M. et al. (2020). Social environment modulates investment in sex trait versus lifespan: red deer produce bigger antlers when facing more rivalry. Scientific Reports, 10, 9234\.

\-3D에셋  
https://skfb.ly/6BHXp

# \#\#\# 7\. 멧돼지

\-문헌

멧돼지의 굴토 행동과 토양 교란  
 Bueno, C. G., Alados, C. L., Gómez-García, D., Barrio, I. C., & García-González, R. (2009). Understanding the main factors in the extent and distribution of wild boar rooting on alpine grasslands. Journal of Zoology, 279, 195–202. DOI: 10.1111/j.1469-7998.2009.00607.x.

멧돼지 굴토와 식물 다양성  
 Horčičková, E., et al. (2019). Wild boar (Sus scrofa) increases species diversity of semidry grassland: Field experiment with simulated soil disturbances. Ecology and Evolution, 9(5), 2765–2774. DOI: 10.1002/ece3.4950.

멧돼지 굴토가 토양에 미치는 영향  
 Massei, G., Genov, P. V., Staines, B. W., & Gorman, M. L. (1996). Variability of food availability and effects of wild boar rooting on grassland vegetation in the Macaronesian islands. Journal of Applied Ecology, 33, 513–522.  
 ※ 이 논문은 이번 대화문의 직접 근거로 쓰기보다는 멧돼지 굴토와 식생 영향에 대한 보조 참고문헌으로 두는 게 좋음.

멧돼지 굴토와 토양 특성  
 Mayer, M., Ullmann, W., Heinrich, A., Fischer, C., & Blaum, N. (2022). Effect of Wild Boar (Sus scrofa) Rooting on Soil Characteristics in a Deciduous Forest Affected by Sedimentation. Forests, 13(8), 1234\.

돼지의 가축화와 멧돼지의 관계  
 Larson, G., et al. (2005). Worldwide phylogeography of wild boar reveals multiple centers of pig domestication. Science, 307(5715), 1618–1621.  
 → 돼지의 가축화가 멧돼지 계통과 직접적으로 연결된다는 근거로 사용하기 좋음.

가축돼지의 기원과 멧돼지로부터의 가축화  
 Larson, G., et al. (2007). The origin of the domestic pig: Independent domestication and subsequent introgression. PLoS Genetics, 3(4), e99. DOI: 10.1371/journal.pgen.0030239.

가축돼지의 분류학적 위치  
 NCBI Taxonomy. *Sus scrofa domesticus*.  
 → 현재 NCBI는 가축돼지를 *Sus scrofa*의 **아종**으로 취급하며, *Sus domesticus*를 동물이명(synonym)으로 제시함. 다만 NCBI 자체도 분류학적 명명에 관한 권위 있는 최종 기준은 아니라고 명시하고 있음.

돼지의 진흙 목욕과 체온 조절  
 Baert, S., Aubé, L., Haley, D. B., Bergeron, R., & Devillers, N. (2022). The protective role of wallowing against heat stress in gestating and lactating sows housed outdoors. Physiology & Behavior, 254, 113898\. DOI: 10.1016/j.physbeh.2022.113898.

\-3D에셋  
https://skfb.ly/oSyL7

# \#\#\# 8\. 코끼리

\-문헌

Jannel, A., Nair, J. P., Panagiotopoulou, O., Romilio, A. & Salisbury, S. W. (2019). “Keep your feet on the ground”: Simulated range of motion and hind foot posture of the Middle Jurassic sauropod *Rhoetosaurus brownei* and its implications for sauropod biology. *Journal of Morphology*, 280(6), 849–878. DOI: 10.1002/jmor.20989.

Fischer, M. S., Schaller, N., & others. (2007). The structure of the cushions in the feet of African elephants (*Loxodonta africana*). *Journal of Anatomy*, 210\.  
 → 코끼리 발의 섬유성·지방성 쿠션과 체중 지지, 힘의 분산을 뒷받침하는 자료.

Lee, R. et al. (2016). Foot pressure distributions during walking in African elephants (*Loxodonta africana*). *Journal of Experimental Biology*.  
 → 코끼리의 발바닥 패드가 보행 중 하중을 분산하는 구조와 기능을 뒷받침.

전투코끼리와 알렉산더

Naiden, F. S., Garvin, E. E., Vanderspoel, J. & Epplett, C. (2021). Elephants in Hellenistic Warfare. In W. Heckel, F. S. Naiden, E. E. Garvin & J. Vanderspoel (Eds.), *A Companion to Greek Warfare*. Wiley-Blackwell. DOI: 10.1002/9781119438847.ch15.

Trautmann, T. R. (2015). *Elephants and Kings: An Environmental History*. University of Chicago Press.  
 → 알렉산더 이후 헬레니즘 세계에서 전투코끼리가 중요한 군사 자원으로 활용된 역사적 맥락

Glover, R. F. (1948). The Tactical Handling of the Elephant. *Greece & Rome*, 17(49), 1–11. DOI: 10.1017/S0017383500009748.  
 → 히다스페스 전투와 히파시스강에서의 알렉산더 군대의 진격 거부, 전투코끼리에 대한 군사적 위협 인식을 다루는 고전 연구.

\-3D에셋  
https://skfb.ly/QWCR

# \#\#\# 9\. 이상한 부리를 가진 새

\-문헌  
새의 부리 형태와 먹이 이용의 관계  
 Abzhanov, A., Kuo, W. P., Hartmann, C., Grant, B. R., Grant, P. R., & Tabin, C. J. (2006). The calmodulin pathway and evolution of elongated beak morphology in Darwin's finches. Nature, 442, 563–567. DOI: 10.1038/nature04843.

다윈핀치의 부리 다양성과 적응방산  
 Grant, P. R., & Grant, B. R. (2024). From microcosm to macrocosm: adaptive radiation of Darwin's finches. Evolutionary Journal of the Linnean Society, 3(1), kzae006. DOI: 10.1093/evolinnean/kzae006.

다윈핀치의 생태적 다양화와 적응방산  
 Reaney, A. M., et al. (2020). Ecological and morphological determinants of evolutionary diversification in Darwin's finches and their relatives. Ecology and Evolution, 10, 14020–14034. DOI: 10.1002/ece3.6994.

다윈핀치의 니치분화와 생태적 다양성  
 De León, L. F., et al. (2019). Urbanization erodes niche segregation in Darwin's finches. Evolutionary Applications, 12, 1626–1638. DOI: 10.1111/eva.12721.

다윈핀치의 적응방산에 대한 종합적 고찰  
 Tebbich, S., Sterelny, K., & Teschke, I. (2010). The tale of the finch: adaptive radiation and behavioural flexibility. Philosophical Transactions of the Royal Society B, 365, 1101–1110. DOI: 10.1098/rstb.2009.0292.

\-3D에셋  
https://skfb.ly/oLDKA

# \#\#\# 10\. 뱀을 물고 있는 야수

\-문헌  
붉은 여왕 가설의 기초 개념  
 Van Valen, L. (1973). A new evolutionary law. Evolutionary Theory, 1, 1–30.  
포식자와 피식자의 공진화 및 붉은 여왕 가설  
 Stenseth, N. C. & Maynard Smith, J. (1984). Coevolution in ecosystems: Red Queen evolution or stasis? Evolution, 38(4), 870–880.  
스피팅코브라의 사람 얼굴에 대한 독 분사 행동  
 Westhoff, G., Tzschätzsch, K. & Bleckmann, H. (2005). The spitting behavior of two species of spitting cobras. Journal of Comparative Physiology A, 191(10), 873–881. DOI: 10.1007/s00359-005-0010-8.  
스피팅코브라의 표적 추적과 독 분사 정확성  
 Westhoff, G., Boetig, M., Bleckmann, H. & Young, B. A. (2010). Target tracking during venom “spitting” by cobras. Journal of Experimental Biology, 213(11), 1797–1802. DOI: 10.1242/jeb.037135.  
스피팅코브라의 진화와 초기 인류와의 시기적 연관성  
 Kazandjian, T. D., Petras, D., Robinson, S. D., et al. (2021). Convergent evolution of pain-inducing defensive venom components in spitting cobras. Science, 371(6527), 386–390. DOI: 10.1126/science.abb9303.

\-3D에셋  
https://skfb.ly/6XUDU

# \#\#\# 11\. 볏을 가진 새

\-문헌  
볏을 가진 새의 성선택과 성적이형  
 Andersson, M. (1994). Sexual Selection. Princeton University Press.

조류의 성적이형과 성 차이의 발생  
 Mank, J. E. (2009). Sex and the evolution of reproductive strategies. Nature Reviews Genetics, 10, 504–513.

조류의 ZZ/ZW 성결정 체계  
 Smith, C. A., Katz, M., & Sinclair, A. H. (2005). DMRT1 is upregulated in the gonads during female-to-male sex reversal in chickens. Biology of Reproduction, 72(2), 401–407.

조류의 성염색체와 성결정  
 Graves, J. A. M. (2014). Avian sex, sex chromosomes, and dosage compensation in the age of genomics. Chromosome Research, 22(1), 45–57. DOI: 10.1007/s10577-014-9409-9.

조류의 Z 염색체 유전자 발현과 성적 차이  
 Arnold, A. P., Itoh, Y., & Melamed, E. (2008). A bird's-eye view of sex chromosome dosage compensation. Annual Review of Genomics and Human Genetics, 9, 109–127. DOI: 10.1146/annurev.genom.9.081307.164220.

조류에서 Z 염색체 발현량과 성 차이  
 Itoh, Y., Melamed, E., Yang, X., Kampf, K., Wang, S., Yehya, N., et al. (2007). Dosage compensation is less effective in birds than in mammals. Journal of Biology, 6, 2\.

균류의 다양한 교배형  
 Kües, U., & Casselton, L. A. (1992). The origin of multiple mating types in mushrooms. Journal of Evolutionary Biology, 5(4), 529–545.

균류의 다중 교배형 체계  
 Ni, M., Feretzaki, M., Sun, S., Wang, X., & Heitman, J. (2011). Sex in fungi. Annual Review of Genetics, 45, 405–430.

균류의 교배형과 ‘성’ 개념의 구분  
 Wilson, M. A., & others. (2023). Sex Without Sexes: Can the Cost of Finding a Mate Explain Diversity in Fungal Mating Systems? Integrative and Comparative Biology.

\-3D에셋  
https://skfb.ly/o7yPD

# \#\#\# 12\. 악어

\-문헌

악어류의 형태 진화와 생태적 다양성  
 Godoy, P. L. (2020). Crocodylomorph cranial shape evolution and its relationship with body size and ecology. *Journal of Evolutionary Biology, 33*(1), 4–21.

악어류의 진화와 형태적 보수성  
 Stockdale, M. T. & Benton, M. J. (2021). Environmental drivers of body size evolution in crocodile-line archosaurs. *Communications Biology, 4*.

파충류의 학습과 인지능력  
 Wilkinson, A. & Huber, L. (2012). Cold-blooded cognition: reptilian cognitive abilities. *Current Opinion in Neurobiology, 22*(6), 920–926.

파충류의 학습능력에 대한 연구 동향  
 MacLean, E. L. et al. (2020). Learning in non-avian reptiles 40 years on: advances and promising new directions. *Biology Letters, 16*(10), 20200415\.

파충류의 인지능력에 대한 기존 관점 재검토  
 Roth, T. C. II, Krochmal, A. R. & LaDage, L. D. (2019). Reptilian Cognition: A More Complex Picture via Integration of Neurological Mechanisms, Behavioral Constraints, and Evolutionary Context. *BioEssays, 41*(8), e1900033.

나일악어의 폐와 단방향성 기류  
 Schachner, E. R., Hutchinson, J. R. & Farmer, C. G. (2013). Pulmonary anatomy in the Nile crocodile and the evolution of unidirectional airflow in Archosauria. *PeerJ, 1*, e60.

악어와 조류의 폐 비교 및 단방향성 기류의 진화  
 Farmer, C. G. (2015). Similarity of Crocodilian and Avian Lungs Indicates Unidirectional Flow Is Ancestral for Archosaurs. *Integrative and Comparative Biology, 55*(6), 962–971.

누의 이동과 나일악어의 포식  
 PBS Nature. (2022). *Running with the Beest*.

누의 강 도하와 나일악어  
 PBS Nature. (2022). “Wildebeest Cross Crocodile-Infested Water.” *Running with the Beest*.

\-3D에셋  
https://skfb.ly/pAot9

# \#\#\# 13\. 물고기

\-문헌

물고기의 지느러미와 사지의 진화  
 Shubin, N. H., Daeschler, E. B. & Jenkins, F. A. Jr. (2006). The pectoral fin of Tiktaalik roseae and the origin of the tetrapod limb. Nature, 440, 764–771. DOI: 10.1038/nature04637.

물고기 턱과 인두궁의 진화  
 DeLaurier, A. (2019). Evolution and development of the fish jaw skeleton. WIREs Developmental Biology, 8(1), e337. DOI: 10.1002/wdev.337.

척추동물 턱의 진화  
 Kuratani, S. (2012). Evolution of the vertebrate jaw from developmental perspectives. Evolution & Development, 14(1), 76–92. DOI: 10.1111/j.1525-142X.2011.00523.x.

아가미활과 턱·가운데귀의 진화  
 Woronowicz, K. C. & Schneider, R. A. (2019). Molecular and cellular mechanisms underlying the evolution of form and function in the amniote jaw. EvoDevo, 10, 17\. DOI: 10.1186/s13227-019-0131-8.

『패자의 생명사』  
 이나가키 히데히로. (2022). 『패자의 생명사: 38억 년 생명의 역사에서 살아남은 것은 항상 패자였다\!』 박유미 역, 장수철 감수. 더숲. ISBN: 9791190357975\.

\-3D에셋  
[https://skfb.ly/oEuLR](https://skfb.ly/oEuLR)  
https://skfb.ly/6U8op

# \#\#\# 14\. 물범

\-문헌

물범의 수렴진화와 수중 적응  
 Nery, M. F., Borges, B., Dragalzew, A. A., & Kohlsdorf, T. (2016). Selection on different genes with equivalent functions: the convergence story told by Hox genes along the evolution of aquatic mammalian lineages. *BMC Evolutionary Biology, 16*, 233\. DOI: 10.1186/s12862-016-0682-4.

기각류의 형태와 수영 방식 비교  
 Pierce, S. E., & Schmitt, D. (2011). Comparative axial morphology in pinnipeds and its correlation with aquatic locomotory behaviour. *Journal of Anatomy, 219*(4), 462–472. DOI: 10.1111/j.1469-7580.2011.01406.x.

물범과 물개·바다사자의 수영 방식과 수렴  
 Grant, R. A., et al. (2021). Convergent evolution of forelimb-propelled swimming in seals. *Current Biology, 31*(11), 2404–2409.e2. DOI: 10.1016/j.cub.2021.03.019.

물범과 물개·바다사자의 육상 이동 차이  
 Mizuno, F., & Kohno, N. (2024). How otariids walk: a comparative axial analysis of the hind limb movements of California and South American sea lions. *Marine Mammal Science, 40*(1), 196–209. DOI: 10.1111/mms.13075.

*Zalophus japonicus*의 분류와 명명 역사  
 Peters, W. C. H. (1866). Hr. W. Peters gab einen Nachtrag zu seiner Abhandlung über die Ohrenrobben, Otariae. *Monatsberichte der Königlichen Preussischen Akademie der Wissenschaften zu Berlin*, 665–672.

*Zalophus japonicus*의 분류·기준산지·역사적 분포  
 Mammal Diversity Database. *Zalophus japonicus* (Peters, 1866). American Society of Mammalogists.

\-3D에셋  
https://skfb.ly/6SPy7

# \#\#\# 15\. 수달

\-문헌  
수달류의 분류와 계통  
 Koepfli, K.-P. et al. (2008). Multigene phylogeny of the Mustelidae: Resolving relationships, tempo and biogeographic history of a mammalian adaptive radiation. *BMC Biology, 6*, 10\. DOI: 10.1186/1741-7007-6-10.

해달의 분류 및 진화  
 Sato, J. J. et al. (2006). The molecular phylogeny of mustelids: Effects of evolutionary constraints and incomplete lineage sorting. *Systematic Biology, 55*(3), 425–439. DOI: 10.1080/10635150600769505.

수달의 털과 수중생활·체온 유지  
 Fish, F. E. (1994). Association of propulsive swimming modes with behavior of dolphins and sea otters. *Journal of Mammalogy, 75*(4), 1229–1236.

해달의 털과 단열  
 Williams, T. M., & Yeates, L. C. (2004). The energetics of foraging in sea otters and implications for their survival. *Journal of Experimental Biology, 207*, 2929–2939. DOI: 10.1242/jeb.01103.

해달의 수중 시각  
 Schweikert, L. E. et al. (2020). Evolution of aquatic visual acuity in sea otters. *Proceedings of the Royal Society B, 287*, 20201888\. DOI: 10.1098/rspb.2020.1888.

해달의 감각털 및 수중 감각  
 Dehnhardt, G., Mauck, B., & Bleckmann, H. (1999). Seal whiskers detect water movements. *Nature, 398*, 235–236. DOI: 10.1038/18442.

해양 포유류의 기름 오염과 체온 조절  
 Davis, R. W. et al. (1988). Effects of oil contamination on the thermal insulation of sea otters. *Journal of Wildlife Management, 52*(1), 144–148.

\-3D에셋  
https://sketchfab.com/models/57b88c7e30c74b588f28102177849397

# \#\#\# 16\. 백로 / 왜가리 / 두루미

백로·왜가리의 분류와 명칭  
 Integrated Taxonomic Information System (ITIS). Ardeidae Leach, 1820 — Herons, Egrets, Bitterns.

백로가 왜가리과 내 여러 새를 가리키는 명칭이라는 근거  
 British Trust for Ornithology (BTO). Ardeidae – Herons.

색채 범주화와 무지개  
 Jraissati, Y. (2014). On Color Categorization: Why Do We Name Seven Colors in the Rainbow? Philosophy Compass, 9(6), 376–386. DOI: 10.1111/phc3.12131.

색채의 연속성과 인간의 범주화  
 Franklin, A., Drivonikou, G. V., Bevis, L., Davies, I. R. L., Kay, P., & Regier, T. (2008). Categorical perception of color is lateralized to the right hemisphere in infants, but to the left hemisphere in adults. Proceedings of the National Academy of Sciences, 105(9), 3221–3225.

\-3D에셋  
https://skfb.ly/pvzLN

\#\#\# 17\. 달리는 새

\-문헌  
날지 않는 새의 진화와 비행 능력 상실  
Dececchi, T. A. & Larsson, H. C. E. (2013). Body and limb size dissociation at the origin of birds: implications for scaling and the evolution of flight. Evolution, 67(4), 1235–1246.

새·박쥐·익룡의 날개와 비행 형태의 진화  
 Wang, X., Kellner, A. W. A., Zhou, Z. & Campos, D. A. (2009). Pterosaur diversity and the origin of flight. Science, 326(5958), 250–253.

새·박쥐·익룡의 비행과 수렴진화  
 Lee, M. S. Y., Cau, A., Naish, D. & Dyke, G. J. (2014). Sustained miniaturization and anatomical innovation in the dinosaurian ancestors of birds. Science, 345(6196), 562–566.

수렴진화(Convergent Evolution)의 개념  
 Stayton, C. T. (2015). The definition, recognition, and interpretation of convergent evolution, and two new measures for quantifying and assessing the importance of convergence. Evolution, 69(8), 2140–2153.

진화적 상쇄(Evolutionary Trade-off)  
 Stearns, S. C. (1989). Trade-offs in life-history evolution. Functional Ecology, 3(3), 259–268.

굴절적응(Exaptation)의 개념  
 Gould, S. J. & Vrba, E. S. (1982). Exaptation—A missing term in the science of form. Paleobiology, 8(1), 4–15.

깃털과 비행 이전 기능에 대한 진화적 논의  
 Prum, R. O. & Brush, A. H. (2002). The evolutionary origin and diversification of feathers. The Quarterly Review of Biology, 77(3), 261–295.

환원불가능한 복잡성과 진화적 반론  
 Matzke, N. J. (2003). Evolution in (Brownian) motion: a response to irreducible complexity. Proceedings of the National Academy of Sciences, 100(14), 8233–8235.

\-3D에셋  
https://skfb.ly/onu6x

\#\#\# 18\. 봉황  
\-문헌  
며느리발톱(spur)의 형태와 기능  
Davison, G. W. H. (1985). Avian spurs. Journal of Zoology, 206(1), 117–123.

새와 뱀의 상징적 대칭  
Vaz da Silva, F. (2011). Cosmos in a painting: Reflections on Judeo-Christian creation symbolism. Cosmos, 26, 53–77.

가루다(Garuda)와 나가(Nāga)의 신화적 관계  
Syafrony, A. I. (2015). The Conceptualization of Garuda Myths in Indonesia and Thailand: A Mythological Study. M.A. thesis, Naresuan University.

가루다와 나가의 상징적 대립  
Wessing, R. (2006). Symbolic animals in the land between the waters: Markers of place and transition (Symbolic animals in Indonesia and Southeast Asia). Asian Folklore Studies, 65(2), 205–239.

새와 뱀의 계통적 관계  
Benton, M. J. (2015). Vertebrate Paleontology. 4th ed. Wiley Blackwell.

\-3D에셋  
https://skfb.ly/6TWAv

\#\#\# 19\. 용

뱀탐지 이론과 위협 자극에 대한 주의 편향  
 Isbell, L. A. (2006). Snakes as agents of evolutionary change: The case of the primate visual system. Journal of Human Evolution, 51(1), 1–35.

뱀에 대한 선택적 주의와 탐지  
 LoBue, V., & DeLoache, J. S. (2008). Detecting the snake in the grass: Attention to fear-relevant stimuli by adults and young children. Psychological Science, 19(3), 284–289.

위협 자극에 대한 준비성(Preparedness)과 공포 학습  
 Öhman, A., & Mineka, S. (2001). Fears, phobias, and preparedness: Toward an evolved module of fear and fear learning. Psychological Review, 108(3), 483–522.

뱀에 대한 위협 자극의 선택적 탐지  
 LoBue, V., & DeLoache, J. S. (2010). Superior detection of threat-relevant stimuli in young children. Developmental Science, 13(1), 221–228.

동아시아 용의 신화와 상징  
 Birrell, A. (1993). Chinese Mythology: An Introduction. Johns Hopkins University Press.

용문(龍門)과 잉어의 용 승격 설화  
 Birrell, A. (1993). Chinese Mythology: An Introduction. Johns Hopkins University Press.

\-3D에셋  
https://skfb.ly/pyzur