const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------
// Mock "database" data:
// ---------------------
const courses = [
  [
    {
      "id": 1,
      "code": "751245",
      "name": "Animation & Motion Graphics I",
      "subject": "Media And Entertainment",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Dublin High School For more information, visit the ROP website at www.tvrop.org",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 2,
      "code": "751241",
      "name": "Honors Artist Portfolio",
      "subject": "Media And Entertainment",
      "level": "HP",
      "description": "Open to grades 11, 12. Campus: Dublin High School For more information, visit the ROP website at www.tvrop.org",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 3,
      "code": "751225",
      "name": "Video Game Art & Design",
      "subject": "Media And Entertainment",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Dublin High School For more information, visit the ROP website at www.tvrop.org",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 4,
      "code": "632750",
      "name": "Child Growth And Development",
      "subject": "Child Development And Family Services",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Meets the UC/CSU \"G\" Requirement for Electives. This course is a study of the developmental stages of children from conception through adolescence, personal development, the role of the family and life cycle, and dating and marriage. The course will provide the student with knowledge of the principle theories of child growth and development and their application. The emphasis is on the scienti\ufb01c method, research strategies, historical overview and social and cultural content. Students will participate in simulations using the Empathy Belly and Baby Think It Over. Class discussion and in-class activities will connect the curriculum to student\u2019s own lives. Careers involving children and families will be covered. Students may participate in a mentoring program with a local elementary school or special education class.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 5,
      "code": "751801",
      "name": "Developmental Psychology Of Children I",
      "subject": "Child Development And Family Services",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Foothill High School, Granada High School, Livermore High School For more information, visit the ROP website at www.tvrop.org",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 6,
      "code": "751802",
      "name": "Developmental Psychology Of Children Ii",
      "subject": "Child Development And Family Services",
      "level": "P",
      "description": "Open to grade 12. Campus: TBD For more information, visit the ROP website at www.tvrop.org 21",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 7,
      "code": "751665",
      "name": "\nEnergy And Utilities\nAp Environmental Science",
      "subject": "2024-2025",
      "level": "HP",
      "description": "Open to grades 11, 12. Highly recommended: Completion of two years of high school science - one year of life science and one year of physical science. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). AP Environmental Science meets the UC/CSU \"D\" Requirement for Science. The AP Environmental Science course is a full-year high school course designed to be the equivalent of a one-semester, introductory college course in environmental science. This course has been developed to stress scienti\ufb01c principles and analysis, including laboratory components incorporating knowledge from biology, chemistry, physics and the earth sciences. The course o\ufffders a unique combination of laboratory and \ufb01eldwork through a lens of how human activities integrate into the natural systems of the Earth. Students will study both outdoors and in class. Critical thinking and the construction of solid arguments will explore the many sides of the issues our populations face as more people are required to share fewer resources. The skills required for the course are often learned in seemingly disparate subjects. The breadth of students' academic skills are integrated to examine and explore how our presence and cultural choices impact the natural systems which we all rely upon for our survival and wellbeing. For more information, visit the ROP website at www.tvrop.org",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 8,
      "code": "717014",
      "name": "Computer Integrated Manufacturing",
      "subject": "Engineering And Architecture",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Dublin High School. For more information, visit the ROP website at www.tvrop.org",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 9,
      "code": "632775",
      "name": "Intro To Engineering Design",
      "subject": "Engineering And Architecture",
      "level": "P",
      "description": "One-year course. First course in Project Lead the Way sequence. Open to grades 9, 10, 11, 12. Meets the recommended third year UC/CSU \"D\" Requirement for Science. Introduction to Engineering Design TM is intended to serve as a foundation course within the Project Lead The Way\u00ae Engineering course sequence. All of the topics learned in this course will be used in future courses. 22",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 10,
      "code": "632802",
      "name": "Honors Principles Of Engineering",
      "subject": "Engineering And Architecture",
      "level": "HP",
      "description": "/ PRINCIPLES OF ENGINEERING (P): (Course Code 632800) One-year course. Second course in Project Lead the Way sequence. Open to grades 10, 11, 12. Students may opt to take the course as honors or regular level. Prerequisite: 2.0 Cumulative GPA, C or better in Introduction to Engineering Design. Meets the recommended third year UC/CSU \"D\" Requirement for Science. Principles of Engineering (POE) is a high school-level survey course of engineering. The course exposes students to some of the major concepts that they will encounter in a post secondary engineering course of study. Students have an opportunity to investigate engineering and high-tech careers. POE gives students the opportunity to develop skills and understanding of course concepts through activity-, project-, and problem-based (APPB) learning. Used in combination with a team approach, APPB learning challenges students to continually hone their interpersonal skills, creative abilities, and problem- solving skills based upon engineering concepts. It also allows students to develop strategies to enable and direct their own learning, which is the ultimate goal of education.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 11,
      "code": "686432",
      "name": "Honors Aerospace Engineering",
      "subject": "Engineering And Architecture",
      "level": "HP",
      "description": "One-year course. (FHS Only) Students will travel to school site: Foothill High School. Third/fourth course in Project Lead the Way sequence. O\ufffdered at FHS only alternating years with Honors Digital Electronics. Open to grades 11, 12. Prerequisite: C or better in Honors/Regular Principles of Engineering. Meets the recommended third year UC/CSU \"D\" Requirement for Science. Aerospace Engineering (AE) is a high school-level course intended to propel students\u2019 learning in the fundamentals of atmospheric and space \ufb02ight. As they explore the physics of \ufb02ight, students bring the concepts to life by designing an airfoil, propulsion system, and rockets. They learn basic orbital mechanics using industry-standard software. They also explore robot systems through projects such as remotely operated vehicles. This course is designed for 11th, or 12th grade students. The course exposes students to some of the major concepts that they will encounter in a postsecondary engineering course of study in the area aerospace engineering.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 12,
      "code": "632882",
      "name": "Honors Civil Engineering And Architecture",
      "subject": "Engineering And Architecture",
      "level": "HP",
      "description": "One-year course. (AVHS Only) Students will travel to school site: Amador Valley High School. Third/fourth course in Project Lead the Way sequence. O\ufffdered at AVHS only alternating years with Honors Digital Electronics. Open to grades 11, 12. Prerequisite: C or better in Honors/Regular Principles of Engineering. Meets the recommended third year UC/CSU \"D\" Requirement for Science. Civil Engineering Architecture (CEA) is a high school-level course intended to propel students\u2019 to learn important aspects of building and site design and development. They apply math, science, and standard engineering practices to design both residential and commercial projects and document their work using 3D architecture design software. This course is designed for 11th, or 12th grade students. The course exposes students to some of the major concepts that they will encounter in a postsecondary engineering course of study in the area civil engineering or architecture. Campus: Amador Valley High School, Livermore High School 23",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 13,
      "code": "686442",
      "name": "\nHonors Digital Electronics",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Third/fourth course in Project Lead the Way sequence. O\ufffdered alternating years with Honors Civil Engineering and Architecture at AVHS/Honors Aerospace Engineering at FHS. Students may travel to corresponding school site. Open to grades 11, 12. Prerequisite: C or better in Honors/Regular Principles of Engineering. Meets the recommended third year UC/CSU \"D\" Requirement for Science. Digital Electronics (DE) is a high school-level course intended to introduce students to the world of electronics that is the foundation for all modern electronic devices. Students are introduced to the process of combinational and sequential logic design, engineering standards and technical documentation. This course is designed for 11th, or 12th grade students. The course exposes students to some of the major concepts that they will encounter in a post-secondary engineering course of study in the area of digital electronics.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 14,
      "code": "728021",
      "name": "Health Education",
      "subject": "Health Services And Medical Technology",
      "level": "P",
      "description": "One-semester course. Required for PUSD graduation. Open to grade 9. Meets the UC/CSU \"G\" Requirement for Electives. Students will study the main aspects of health including physical, mental, and social factors. There will be a focus on learning the role students can play in maintaining their own health and well-being through deliberate behaviors and choices. Throughout each unit, students will also learn about communication and the role that di\ufffderent in\ufb02uences a\ufffdect their personal health and the health of others. This curriculum has been articulated with the current 8th grade course and meets the guidelines of the Health Framework for California Public Schools.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 15,
      "code": "751470",
      "name": "Introduction To Health Careers",
      "subject": "Health Services And Medical Technology",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Dublin High School, Granada High School, Livermore High School For more information, visit the ROP website at www.tvrop.org",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 16,
      "code": "751760",
      "name": "Medical Occupations",
      "subject": "Health Services And Medical Technology",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Foothill High School, Granada High School For more information, visit the ROP website at www.tvrop.org",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 17,
      "code": "751490",
      "name": "Nursing Careers",
      "subject": "Health Services And Medical Technology",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Foothill High School For more information, visit the ROP website at www.tvrop.org",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 18,
      "code": "737400",
      "name": "Principles Of Biomedical Science",
      "subject": "Health Services And Medical Technology",
      "level": "P",
      "description": "One-year course. First course in Project Lead the Way sequence. Open to grades 9, 10, 11, 12. Prerequisite: Biology taken concurrently or in a prior year. Meets the UC/CSU \"D\" Requirement for Science. Refer to Science course descriptions for more information. Students will investigate the human body systems and various health conditions including heart disease, diabetes, sickle-cell disease, hypercholesterolemia and infectious diseases. Students will determine the factors that lead to the death of a \ufb01ctional person and investigate lifestyle choices and medical treatments that might have prolonged the person\u2019s life. The activities and projects introduce students to human physiology, medicine, research processes, and bioinformatics. Key biological concepts including homeostasis, metabolism, inheritance of traits, and defense against disease are embedded in the curriculum. Engineering principles including the design process, feedback loops, and the relationship of structure to function, are also incorporated. This course is designed to provide an overview of all the courses in the Biomedical Sciences Program and lay the scienti\ufb01c foundation for subsequent coursework. 24",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 19,
      "code": "772122",
      "name": "\nHonors Human Body Systems",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Second course in Project Lead the Way sequence. Open to grades 10, 11, 12. Meets the UC/CSU \"D\" Requirement for Science. Refer to Science course descriptions for more information. Students examine the interactions of body systems as they explore identity, communication, power, movement, protection, and homeostasis. Students design experiments, investigate the structures and functions of the human body, and use data acquisition software to monitor body functions such as muscle movement, re\ufb02ex, voluntary action, and respiration. Exploring science in action, students build organs and tissues on a skeletal mannequin, work through interesting real world cases and often play the role of biomedical professionals to solve medical mysteries.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 20,
      "code": "751272",
      "name": "Honors Medical Interventions",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Third course in Project Lead the Way sequence. Open to grades 11, 12. Meets the UC/CSU \"D\"Requirement for Science. Refer to Science course descriptions for more information. Students follow the life of a \ufb01ctitious family as they investigate how to prevent, diagnose, and treat disease. Students explore how to detect and \ufb01ght infection; screen and evaluate the code in human DNA; evaluate cancer treatment options; and prevail when the organs of the body begin to fail. Through real-world cases, students are exposed to a range of interventions related to immunology, surgery, genetics, pharmacology, medical devices, and diagnostics.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 21,
      "code": "751090",
      "name": "Sports Medicine/Athletic Trainer I",
      "subject": "2024-2025",
      "level": "P",
      "description": "Open to grades 10, 11, 12. For more information, visit the ROP website at www.tvrop.org",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 22,
      "code": "751550",
      "name": "Sports Medicine Ii",
      "subject": "2024-2025",
      "level": "P",
      "description": "Open to grades 11, 12. For more information, visit the ROP website at www.tvrop.org",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 23,
      "code": "612060",
      "name": "Farm To Fork",
      "subject": "Tourism And Recreation",
      "level": "P",
      "description": "One-year course. O\ufffdered at Village High School and Foothill High School. Open to grades 9, 10, 11, 12. Meets the UC/CSU \"G\" Requirement for Electives. In this course students have two classrooms-a culinary lab and a garden. Students plant and maintain a high school garden. Students learn the origin of their food, from \u201cfarm to fork\u201d, and are more likely to eat fresh fruits and vegetables they weren\u2019t previously familiar with. The garden will be utilized to grow produce for training and demonstrations in all culinary classes. In addition to growing their own food, students learn food preparation techniques, geared to the home cook and the budding professional. Students explore food preparation skills in a professional kitchen, transferrable to their home kitchens. In addition, all students will earn the industry recognized food handler certi\ufb01cation. In both the garden and the culinary lab there is an authentic emphasis on developing work ethic, problem solving, critical thinking, teamwork, leadership skills, taking initiative, and teaching others. Farm to Fork is a concentration course in the high school Culinary Pathway. Daily lessons reinforce the standards and academics, while we practice sustainability and environmental stewardship with an edible garden. All students have an opportunity to \u201cbring their garden home\u201d, when they select seeds to plant and germinate in the greenhouse. Then they bring their container garden home to share with their families, no matter if their home garden is a tiny balcony or large backyard.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 24,
      "code": "676060",
      "name": "Culinary Skills",
      "subject": "Tourism And Recreation",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Meets the UC/CSU \"G\" Requirement for Electives. Culinary Skills is a cooking class appropriate for students with all levels of experience in the kitchen. New foods and \ufb02avor combinations are discovered as students learn the science behind the process and ingredients. Nutrition is emphasized as students learn how to prepare any food to be healthy and delicious at the same time. All categories of foods are prepared. Examples are baked goods, breakfast foods, homemade soups, chili, cakes, pies, ethnic foods, barbecue, soft pretzels, Chinese chicken salad, stir-fry, pizza, and microwave apple crisp. Instruction in the kitchen focuses on equipment use, safety, and professionalism. Students work with partners and in small groups to prepare and enjoy food several times every week. 25",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 25,
      "code": "676430",
      "name": "\nBaking And Pastry",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Meets the UC/CSU \"G\" Requirement for Electives. Baking and Pastry is a culinary class appropriate for students with all levels of experience in the kitchen. New ingredient and \ufb02avor combinations are discovered as students learn the science behind the process and ingredients. Technique is emphasized as students learn how to prepare baked items from scratch. Instruction in making baked products and pastries from many di\ufffderent cultures will take place. Examples are cookies, cakes, babka, focaccia, croissants, cinnamon rolls, mu\ufffdns, pita, pies, tarts, strudel and all sorts of quick and yeast breads. Ice cream, candy making and cake decorating will be taught. A unit on special dietary restrictions involving Gluten, Dairy, Sugar and Egg Free products will be covered. Instruction in the kitchen focuses on food costing, procurement, equipment use, safety, building baking skills and professionalism. There will be a focus on pastry related employment in the industry and other pastry related careers. Students will obtain their eFoodhandler certi\ufb01cation which is required for any hospitality or food service job. Sustainability, minimal food waste, equality in the industry and other current food trends will be covered. Students work with partners and in small groups to prepare and enjoy food several times per week. Baking and Pastry counts as one of the courses in the Culinary Career Pathway.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 26,
      "code": "676330",
      "name": "Catering",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Course may be repeated for credit. Prerequisite: C or better in Farm to Fork, Culinary Skills, or Baking and Pastry. Meets the UC/CSU \"G\" Requirement for Electives. In this foods class, students will operate an on campus business. Students will utilize food preparation techniques while exploring speed and quantity food preparation skills. All aspects of setting up and operating a catering company, including advertising, promotion, long-range planning, and accounting will be covered. There will be an emphasis on developing teamwork, leadership skills, creativity, and professionalism. This is a course for students interested in the culinary arts and hospitality industry (caterer, chef, sports nutrition, food writer, restaurant/hotel manager, baker, health inspector, food service director, food technologist, etc.) as well as for students who want to explore the realities of small business ownership. This course can ful\ufb01ll the Culinary Arts Career Pathway recognition course. This course is articulated with Diablo Valley College and students may receive 2.5 college units for earning a grade of B or better and passing the \ufb01nal exam for DVC Courses CULN 105 and CULN 153 with a score of 80% or higher.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 27,
      "code": "686570",
      "name": "Computer Science Principles",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Meets the recommended third year UC/CSU \"D\" Requirement for Science. This course covers the College Board CS Principles framework. The course does not aim to teach mastery of a single programming language, but aims instead to develop computational thinking, to generate excitement about the \ufb01eld of computing, and to introduce computational tools that foster creativity. The course also aims to build students\u2019 awareness of the tremendous demand for computer specialists and for professionals in all \ufb01elds who have computational skills. Each unit focuses on one or more computationally intensive career paths. The course also aims to engage students to consider issues raised by the present and future societal impact of computing. Students practice problem solving with structured activities and progress to open-ended projects and problems that require them to develop planning, documentation, communication, and other professional skills. Problems aim for ground-level entry with no ceiling so that all students can successfully engage in the problems. Students with greater motivation, ability, or background knowledge will be challenged to work further. Successful completion of this course may prepare the student for the AP Computer Science Principles Examination administered annually in May.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 28,
      "code": "751159",
      "name": "Cybersecurity",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Prerequisite: C or better in Computer Science Principles or AP Computer Science. Meets the UC/CSU \"G\" Requirement for Electives. This course will expose high school students to the ever growing and far reaching \ufb01eld of Cybersecurity. Students accomplish this through problem-based learning, where students role-play as cybersecurity experts and train as 26",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 29,
      "code": "697370",
      "name": "Ap Computer Science A",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 10, 11, 12. Meets the \"C\" UC/CSU Requirement for Math. Refer to Math course descriptions for more information.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 30,
      "code": "697375",
      "name": "Advanced Computer Science For The Contemporary World",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: B or better in AP Computer Science A. Meets the UC/CSU \u201cG\u201d Requirement for Electives. Advanced Computer Science Projects for the Contemporary World is a rigorous opportunity for students to explore technology that is currently being developed in the Real World. Students will collaboratively learn the skills and techniques for creating an original, encapsulated program or app, based on an emerging technology. Working in project groups, students will work with community stakeholders and will develop an original concept or idea that uses emerging technology to help solve a problem in the community. Students will develop collaboration and communication skills, technical writing skills, and learn how to give a professional presentation to a panel of industry professionals. Students taking this course must be able to research and develop their projects beyond the classroom and to work collaboratively to create a \ufb01nal product for evaluation and practical use.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 31,
      "code": "751819",
      "name": "Integrated Marketing Communications",
      "subject": "Sales And Service",
      "level": "P",
      "description": "Open to grades 10, 11, 12. Campus: Amador Valley High School, Foothill High School, Dublin High School, Granada High School For more information, visit the ROP website at www.tvrop.org.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 32,
      "code": "751818",
      "name": "Economics Of Business Ownership",
      "subject": "Sales And Service",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Amador Valley High School, Foothill High School, Dublin High School, Granada High School For more information, visit the ROP website at www.tvrop.org.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 33,
      "code": "751825",
      "name": "Sports And Entertainment Marketing",
      "subject": "Sales And Service",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Foothill High School, Dublin High School For more information, visit the ROP website at www.tvrop.org.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 34,
      "code": "751125",
      "name": "Introduction To Criminal Justice",
      "subject": "Public Services",
      "level": "P",
      "description": "Open to grades 10, 11, 12. Campus: Amador Valley High School, Foothill High School, Dublin High School, Livermore High School For more information, visit the ROP website at www.tvrop.org.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 35,
      "code": "751430",
      "name": "Criminal Justice Academy",
      "subject": "Public Services",
      "level": "P",
      "description": "Open to grades 11, 12. Note: PUSD students enrolled in Criminal Justice Academy may apply to have up to 10 credits of physical education waived beginning in the sophomore year (cannot waive freshman PE). Applications can be found on each school\u2019s website. Campus: Las Positas College For more information, visit the ROP website at www.tvrop.org.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 36,
      "code": "751000",
      "name": "Auto Body Repair I",
      "subject": "Transportation Technology",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Livermore High School For more information, visit the ROP website at www.tvrop.org.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 37,
      "code": "751010",
      "name": "Advanced Auto Body Repair",
      "subject": "Transportation Technology",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Livermore High School For more information, visit the ROP website at www.tvrop.org.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 38,
      "code": "751060",
      "name": "Automotive Technology",
      "subject": "Transportation Technology",
      "level": "P",
      "description": "Open to grades 11, 12. Campus: Livermore High School For more information, visit the ROP website at www.tvrop.org 28",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 39,
      "code": "653635",
      "name": "\nEnglish\nFreshman English",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 9. Meets the \"B\" UC/CSU Requirement for English. Freshman English is a year-long course that focuses on California Standards in English-Language Arts beyond middle school to develop broader and deeper understanding of more complex texts, more advanced critical thinking and inferential reading skills, and more sophisticated writing experiences. Listening and speaking builds upon the reading skills through rich class discussions of those texts and presentations that develop oral delivery and media presentation ability. Students have many opportunities to practice e\ufffdective speaking and listening skills through informal classroom discussions and formally prepared presentations. Examples of speaking applications include delivery of a narrative, research-based, argumentation, and/or expository presentations. Reading comprehension skills are strengthened through close examination of a variety of texts and genres, including the novel, short \ufb01ction, non-\ufb01ction, poetry, and drama. These standards lay the foundation for college and career readiness by guiding students toward independent close reading and comprehension of sophisticated texts of all kinds. The reading comprehension emphasis is twofold: (1) on the recognition and analysis of literary features across genres; and (2) on the analysis of organizational patterns, and positions advanced in non-\ufb01ction modes of writing. Writing standards escalate expectations of student work through practice emphasizing organization, focus, analysis, revision, research, and the appropriate application of technology.The core freshman writing experience includes response to literature, personal narrative, argumentation, and research writing, as well as smaller writing responses, both formal and informal.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 40,
      "code": "653640",
      "name": "Honors Freshman English",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 9. Recommended prerequisite: B or higher in 8th Grade English. Summer reading assignments may be required. Meets the \"B\" UC/CSU Requirement for English. See Freshman English description above. At the honors level, the curriculum is enhanced through supplemental readings and writing assignments, with the intent of preparing students for continued participation in the honors program, and potential enrollment in AP classes. Seminars and informal class discussions will delve into greater depth and attempt to explore nuance and craft in a meaningful way. Evaluation of student work at this level is more rigorous; expectations at subsequent levels will be high as students are electing a more challenging course.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 41,
      "code": "653655",
      "name": "Sophomore English",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 10. Meets the \"B\" UC/CSU Requirement for English. This course exposes students to challenging classic and contemporary \ufb01ction and non\ufb01ction texts, all aligned to the California Standards for English Language Arts in Grade 10. The course includes a thorough review of various genres, the principles of grammar and punctuation, and strategies for e\ufffdective reading, speaking and listening, and writing. The course places an emphasis, per state standards, on \u201cworks on exceptional craft and thought whose range extends across genres, cultures, and centuries.\u201d The reading strand is built around Life of Pi -or- The Kite Runner as a core text. In addition, all students will be exposed to Shakespeare, as well as a selection of culturally diverse supplemental texts. Students will practice critical thinking, comprehension, word analysis, reading strategies, literary response and analysis. A listening and speaking strand builds upon the reading strand through rich classroom discussions of these texts, as well as presentations utilizing a variety of digital media. Speaking opportunities range from classroom discussions of texts in a seminar format, to more formal speaking opportunities, individually and in groups. 29",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 42,
      "code": "653660",
      "name": "Honors Sophomore English",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 10. Recommended prerequisite: B or higher in Honors Freshman English. Summer reading assignments may be required. Meets the \"B\" UC/CSU Requirement for English. See Sophomore English description above. At the honors level, the curriculum is enhanced through supplemental readings and writing assignments, with the intent of preparing students for continued participation in the honors program, and potential enrollment in AP classes. Seminars and informal class discussions will delve into greater depth and attempt to explore nuance and craft in a meaningful way. Evaluation of student work at this level is more rigorous; expectations at subsequent levels will be high as students are electing a more challenging course.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 43,
      "code": "653795",
      "name": "Junior English",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 11. Meets the \"B\" UC/CSU Requirement for English. This course exposes students to classic and contemporary \ufb01ction and non\ufb01ction texts, all aligned to the California Standards for English Language Arts in Grade 11. These texts become a launch for writing in three genres: argumentative, expository, and narrative. The course also includes a thorough review of the principles of grammar and punctuation, and strategies of e\ufffdective writing.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 44,
      "code": "653800",
      "name": "Honors Junior English",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. (FHS Only) Open to grade 11. Recommended prerequisite: B or higher in Honors Sophomore English. Meets the \"B\" UC/CSU Requirement for English. This course is designed for those students who have demonstrated excellence in the past in both literature and composition skills. The course is based on studies in American Literature, rigorous practice in strengthening expository writing skills, improving sentence structure, vocabulary and grammar usage, and improving critical thinking skills. All students will study the central works listed for the eleventh grade.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 45,
      "code": "653000",
      "name": "African American Literature",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 11 and 12. Meets the 11th and 12th Grade English requirement and meets the \"B\" UC/CSU Requirement for English. In this course, students will be exposed to numerous African American writers, from a variety of times and places. In looking at literature through the lens of the African American community, students will grapple with the struggles and successes represented in the text, while analyzing literature from a variety of genres, and using a multitude of analytical skills. Speci\ufb01cally, students will examine essays, speeches, novels, poems, oral literature, and plays, represented by writers from the mid-1700s through our present day. In addition to looking at struggles and successes, students will also analyze the connection between historical events in the African American community and literature, as well as major themes within the literature that are still relevant today, including equality, freedom, and other ideas.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 46,
      "code": "653435",
      "name": "Ap English Language And Composition",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grade 11. Highly recommended: B or higher in Honors Sophomore English. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Summer reading assignments may be required. Meets the 11th Grade English requirement and meets the \"B\" UC/CSU Requirement for English. This course aligns with the California State Standards for 11/12 English Language Arts Instruction and with the English Language and Composition Course goals as delineated in the College Board Course Description. The course teaches students to closely read rich, complex texts in a variety of forms and subjects and to respond to these texts in a mature, e\ufffdective, and nuanced composition. The literary content is based on reading in a variety of periods, disciplines, and contexts within the traditions of American literature, social, and political thought. AP English Language and Composition is a rigorous college-level English course that satis\ufb01es high school English and university entrance requirements and prepares the student for the AP English Language and Composition Examination, given in May, for which 30",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 47,
      "code": "653505",
      "name": "Advanced Composition",
      "subject": "Senior English Courses",
      "level": "P",
      "description": "One-semester course. (AVHS Only). Open to grade 12. Meets the 12th Grade English requirement when paired with World Literature. Meets the \"B\" UC/CSU Requirement for English. This rigorous course is designed to prepare students for college and career level writing styles and expectations. The class will focus primarily on expository and persuasive writing, but will also include observation and re\ufb02ection. Students will build vocabulary, logic and critical thinking through writing, research and revision processes. Class discussion, peer response and editing procedures, and classroom learning activities will be supplemented with primary source and library research and with a great deal of outside student writing and revision. One-semester course to be taken with one semester of World Literature or one semester of English Literature.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 48,
      "code": "653440",
      "name": "British Literature",
      "subject": "Senior English Courses",
      "level": "P",
      "description": "One-year course. Open to grade 12. Meets the 12th Grade English requirement and meets the \"B\" UC/CSU Requirement for English. British Literature is a chronological survey of literature of the British Empire from Beowulf (ca 445 A.D.) to the present. Students will examine the changes the English language has undergone as a result of historic and social shifts. Core and supplemental works vary by semester, and may include Shakespeare\u2019s The Tragedy of Macbeth, Charlotte Bront\u00eb\u2019s Jane Eyre, Chaucer\u2019s The Canterbury Tales, J.R.R. Tolkien\u2019s The Hobbit, and Aldous Huxley\u2019s Brave New World.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 49,
      "code": "654730",
      "name": "Expository Reading And Writing",
      "subject": "Senior English Courses",
      "level": "P",
      "description": "One-year course. Open to grade 12. Meets the 12th Grade English requirement and meets the \"B\" UC/CSU Requirement for English. Contemporary Controversy and Non\ufb01ction invites students to consider and debate provocative issues in current Western culture. The course emphasis will foster the student\u2019s ability to argue from informed perspectives and to extend their understanding of complex reading material in timed and extended writing assignments. Essential to the curriculum is the deepening of students\u2019 critical reading, writing and thinking skills as they deal with expository prose. Based on the California State University\u2019s Twelfth Grade Expository Reading and Writing Course, this rhetoric and composition course for seniors will enable them to meet college-level literacy demands. The course is built around in-depth studies of various expository, analytical, and argumentative writing on non-literary, controversial issues taken from respected news journals and magazines. Core works will include Krakauer\u2019s Into the Wild and other non-\ufb01ction publications.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 50,
      "code": "653210",
      "name": "English Class",
      "subject": "Senior English Courses",
      "level": "P",
      "description": "One-year course. Open to grade 12. Meets the 12th Grade English requirement and meets the \"B\" UC/CSU Requirement for English. Literature and The Dynamics of Social Justice is a one-year interdisciplinary English class that seeks to analyze the cause, e\ufffdect and consequence of social injustices by applying critical thinking and ethical reasoning skills to social justice issues through the examination of scienti\ufb01c \ufb01elds of sociology and psychology, as well as history and the arts in order to grapple with essential questions about human relationships, moral decision-making, and justice. It focuses on the study of literature, history, art, and \ufb01lm to examine issues of identity, membership in society, and advocacy for a just society by challenging injustice and valuing diversity. The course includes extensive reading with a primary focus on non\ufb01ction resources, in-depth discussion, and substantial practice in writing to encourage a critical examination of human behavior as it relates to the issues of social justice.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 51,
      "code": "653480",
      "name": "World Literature",
      "subject": "Senior English Courses",
      "level": "P",
      "description": "One-year course. Open to grade 12. Meets the 12th Grade English requirement and meets the \"B\" UC/CSU Requirement for English. World Literature reaches out to the corners of the globe and mines the history of man to illuminate the student with varied and exciting literature. The course takes the reader from the works of the ancient world through the cornerstones of western 31",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 52,
      "code": "653425",
      "name": "Ap English Literature And Composition",
      "subject": "Senior English Courses",
      "level": "HP",
      "description": "One-year course. Open to grade 12. Highly recommended: B or higher in AP English Language and Composition. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the 12th Grade English requirement and meets the \"B\" UC/CSU Requirement for English. Advanced Placement English Literature is a year-long elective course that presents an integrated, literature-based program focused on close reading and analyzing literary and non\ufb01ction tests. Frequent writing and close reading techniques are emphasized in a genre survey that covers all important literary forms, including lyric, narrative and dramatic poetry, tragedy and comedy, as well as short \ufb01ction, novella, novel and essay forms. Important works of literature from the British and American tradition, as well as classics of world literature, from Borges to Kafka to Viet Thanh Nguyen to Ishaguro to Morrison, de\ufb01ne the range of the class, with readings from early modern English, including but not limited to Shakespeare, Donne and Marvel, on through contemporary \ufb01ction and poetry, as well as non\ufb01ction selections, including essays and literary criticism. This course aligns with the California State Standards for 11/12 English Language Arts Instruction and with the English Literature and Composition Course goals as delineated in the College Board Course Description.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 53,
      "code": "653000",
      "name": "African American Literature",
      "subject": "Senior English Courses",
      "level": "P",
      "description": "One-year course. Open to grades 11 and 12. This course meets the 11th and 12th Grade English requirement and meets the \"B\" UC/CSU Requirement for English. In this course, students will be exposed to numerous African American writers, from a variety of times and places. In looking at literature through the lens of the African American community, students will grapple with the struggles and successes represented in the text, while analyzing literature from a variety of genres, and using a multitude of analytical skills. Speci\ufb01cally, students will examine essays, speeches, novels, poems, oral literature, and plays, represented by writers from the mid-1700s through our present day. In addition to looking at struggles and successes, students will also analyze the connection between historical events in the African American community and literature, as well as major themes within the literature that are still relevant today, including equality, freedom, and other ideas.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 54,
      "code": "653420",
      "name": "Creative Writing",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Course may be repeated for credit. Meets the \"G\" UC/CSU Requirement for Electives. Throughout this course, students will study examples of master writers in an attempt to develop and re\ufb01ne their own sense of style. Fiction, drama, poetry, and non\ufb01ction will be the focus of exploration and creation. Students will be involved in individual writing projects, group collaborations, peer critiquing, and oral presentations. Through breaking writing styles into their myriad components, students will learn to further develop and improve their own creative styles. Students will learn about careers in writing as well as have an opportunity to publish their work and work collaboratively with the drama and video production classes to have their work brought to life.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 55,
      "code": "653308",
      "name": "Debate",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Course may be repeated for credit. Meets the \"G\" UC/CSU Requirement for Electives. This is a survey course which introduces students to a wide range of journalism topics including the history of media in America, law and ethics, the functions of the newspaper, interviewing, reporting the news, features, sports and editorial writing, word processing, desktop publishing, photography, layout theory and design, sales and teamwork. Students produce the school newspaper and explore and produce broadcast journalism.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 56,
      "code": "653302",
      "name": "Advanced Journalism",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Recommended prerequisite: Journalism 1-2 or teacher approval. Students must also \ufb01ll out an application and be accepted into Advanced Journalism. Course may be repeated for credit. Meets the \"G\"",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 57,
      "code": "653310",
      "name": "Publications/Yearbook",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Requirement: 2.5 GPA or higher. Recommendation: C or better in English. Application required. Course may be repeated for credit. Meets the \"G\" UC/CSU Requirement for Electives. Applications are available in the spring and selected applicants will be contacted by the adviser for an interview. Incoming sophomores, juniors and seniors are encouraged to apply. Incoming freshmen interested in taking the course need to meet with the adviser prior to the beginning of the fall term. Enrollment allowed only with permission of instructor. Yearbook is a class speci\ufb01cally designed to record the history of the school, its students, and the events that occur throughout the year. It provides an opportunity for students to apply photojournalistic techniques as they work together to tell a story and/or communicate a message. Yearbook sta\ufffd members have the unique ability to create a \u201cbook of memories\u201d for people for years to come. Students will also create a variety of other projects/lessons when deadlines are not pressing that will directly enhance their ability to take better photos, layout design and edit photos. Deadlines are vital to this class. Teamwork is important to meeting those deadlines.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 58,
      "code": "653315",
      "name": "Advanced Publications/Yearbook",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Requirement: 2.5",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 59,
      "code": "654065",
      "name": "Advanced English Language Development 3 & 4",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Course may be repeated for credit. Meets the \"G\" UC/CSU Requirement for Electives. Course is open to students identi\ufb01ed as English Language Learners at the Emerging and Expanding levels. Advanced ELD is a course for English Learners, including Long-Term English Learners, and other students who haven\u2019t developed strong academic literacy skills in English. The course builds student competence and con\ufb01dence through partner work and collaborative instructional routines needed for success in college and career. Students will focus on academic vocabulary development, language, syntax, grammar and writing structures through close reading of grade level informational and literary texts. In addition, students will learn oral and written sentence frames to gradually release responsibility and gain independence. Each lesson will provide language to facilitate discussion and o\ufffder multiple opportunities to use language employing varying group strategies. These lessons are designed to foster verbal English skills even when students are crafting a written product. The curriculum will focus on developing reading, writing, speaking, and listening skills with ample support and structured discourse routines.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 60,
      "code": "654025",
      "name": "Sheltered English",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Course may be repeated for credit. Meets the 9, 10, 11 and/or 12 English graduation requirement. Up to 10 credits may be used to ful\ufb01ll the UC/CSU \"B\" requirement for English if taken during grades 9, 10, or 11. Course is open to students identi\ufb01ed as English Language Learners at the Emerging and Bridging levels. Sheltered English is a year-long course for English Learners at the emerging and bridging stage of language acquisition and Long-Term English Learners. The course utilizes National Geographic\u2019s Edge Program Level C curriculum and is designed to prepare all students for college and career success with dynamic content that is aligned to California State Standards through the use of multicultural literature, challenging informational texts, and online resources. Students begin each unit with an essential question that serves as the spine of the unit. Embedded in each unit are lessons that focus on literary analysis, structural analysis, vocabulary development, and grammar, through close reading of grade level informational and literary texts. Each lesson provides topics to facilitate discussion and o\ufffder multiple opportunities to use language employing varying group strategies. These lessons are designed to foster both verbal and written English skills.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 61,
      "code": "654035",
      "name": "English Language Development Support 1 & 2",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Course may be repeated for credit. Meets the \"G\" UC/CSU Requirement for Electives. Course is open to students identi\ufb01ed as English Language Learners at the Emerging and Expanding levels.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 62,
      "code": "697170",
      "name": "Algebra I",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Recommended for grade 9, but also open to grades 10, 11, 12. Meets the \"C\" UC/CSU Requirement for Mathematics. Topics include quantities and modeling, functions, equations and inequalities, statistical models in one and two variables, linear systems and piecewise de\ufb01ned functions, exponential relationships, polynomial operations, quadratic functions and modeling, and inverse relationships.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 63,
      "code": "697175",
      "name": "Math Ii",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Recommended for grade 10, but also open to grades 11, 12 . Prerequisite: Successful completion of Algebra I. Meets the \"C\" UC/CSU Requirement for Mathematics. Topics include transformation and congruence, lines, angles, triangle congruence criteria, quadrilaterals and coordinate proof, similarity, trigonometry, properties of circles, measurement and modeling in two and three dimensions and probability.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 64,
      "code": "697180",
      "name": "Math Iii",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Recommended for grade 11, but also open to grade 12. Prerequisite: Successful completion of Math II. This is the \ufb01rst half of a two year Algebra II sequence. Meets the \"C\" UC/CSU Requirement for Mathematics. This course covers half of the California State Standards of a full Algebra II course and is a further exploration of the real number system with extension into the complex numbers. Students analyze and formulate appropriate solutions, manipulate algebraic expressions to put them in more useful forms, extend the use of trigonometry to the laws of sines and cosines, connect right triangle de\ufb01nitions with trigonometric functions and further develop the ability to construct convincing arguments and to support or prove assertions. Topics include linear and quadratic functions, inequalities, logarithms and exponents, equations in more than one variable, conic sections probability, and sequence and series. A scienti\ufb01c calculator is required. A graphing calculator is used intermittently through the curriculum.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 65,
      "code": "697185",
      "name": "Math Iv",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Recommended for grade 12. Prerequisite: Successful completion of Math III. Meets the \"C\" UC/CSU Requirement for Mathematics. The Math IV course is designed to enhance and expand the mathematical content and concepts of intermediate algebra II presented in Math III. Topics for Math IV include logical reasoning and problem solving, exploring radical expressions and functions, logarithmic and exponential functions, right triangle trigonometry and graphing trigonometric functions, sequences and series, statistics, and data analysis.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 66,
      "code": "697100",
      "name": "Geometry",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Recommended for grades 9 or 10, but also open to grades 11, 12. Prerequisite: Successful completion of Algebra I. Meets the \"C\" UC/CSU Requirement for Mathematics. 36",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 67,
      "code": "697110",
      "name": "Honors Geometry",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Recommended for grades 9 or 10. Prerequisite: B or better in Honors Algebra (8th Grade) or Algebra I (9th grade), or A in Fundamentals Algebra 1B. Meets the \"C\" UC/CSU Requirement for Mathematics. This course is a challenging, in-depth, integrated course in plane, solid, and coordinate geometry. The concepts of mathematical proof, logical reasoning and problem solving are emphasized. Topics include lines in a plane, proof, parallel and perpendicular lines, compass and straightedge constructions, congruent triangles, properties of triangles, quadrilaterals, transformations, similarity, right triangles and trigonometry, circles, area, space measurements, and the concept of locus.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 68,
      "code": "697140",
      "name": "Data Science",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. (PVA Only) Open to grades 9, 10, 11, 12. Meets the UC/CSU \u201cC\u201d Requirement for Mathematics. In this course students will learn to understand, ask questions of, and represent data through project-based units. The units will give students opportunities to be data explorers through active engagement, developing their understanding of data analysis, sampling, correlation/causation, bias and uncertainty, modeling with data, making and evaluating data-based arguments, and the importance of data in society. At the end of the course, students will have a portfolio of their data science work to showcase their newly developed knowledge and understanding. The curriculum will be adaptable so that teachers can either use the data sets provided or bring in data sets most relevant to their own students. This data science course will provide students with opportunities to understand the data science process of asking questions, gathering and organizing data, modeling, analyzing and synthesizing, and communicating. Students will work through this process in a variety of contexts. Students learn through making sense of complex problems, then through an iterative process of formulation and reformulation coming to a reasoned argument for the choices they will make.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 69,
      "code": "697080",
      "name": "Algebra Ii",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Successful completion of Geometry. Meets the \"C\" UC/CSU Requirement for Mathematics. This second\u2010year algebra course is a further exploration of the real number system with extension into the complex numbers. Students analyze and formulate appropriate solutions, manipulate algebraic expressions to put them in more useful forms, extend the use of trigonometry to the laws of sines and cosines, connect right triangle de\ufb01nitions with trigonometric functions and further develop the ability to construct convincing arguments and to support or prove assertions. Topics include polynomial functions, inequalities, logarithms and exponents, equations in more than one variable, conic sections, probability, and sequence and series. A graphing calculator is used throughout the course.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 70,
      "code": "697090",
      "name": "Honors Algebra Ii",
      "subject": "Other English Courses",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: C or better in Honors Geometry. Meets the \"C\" UC/CSU Requirement for Mathematics. This challenging discipline complements and expands the mathematical content and concepts of Algebra I and geometry through in\u2010depth explorations and rigorous study. It is more rigorous and presents students with learning challenges of greater depth and complexity than Intermediate Algebra II. Students who master Honors Intermediate Algebra II will gain experience with algebraic solutions of problems in various content areas, including functions, transformations of linear and non-linear relations, exploring rational expressions, equations, and inequalities, solving systems of equations and inequalities with multiple variables using a variety of methods, studying logarithmic functions and their inverses, trigonometric functions and the unit circle, polynomial functions, imaginary numbers, and complex roots, investigate biases, standard normal distributions and statistical analysis, probability, arithmetic and geometric sequences and series. A graphing calculator will be used on a daily basis to model Mathematical practices. 37",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 71,
      "code": "697200",
      "name": "\nPre-Calculus",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Successful completion of Algebra II or Math IV. Meets the \"C\"",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 72,
      "code": "697120",
      "name": "Honors Pre-Calculus",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Algebra II with a grade of C or better. Meets the \"C\" UC/CSU Requirement for Mathematics. This course is structured around investigations and problem solving. Students will explore concepts and develop mathematical relationships through observation, application, and both formal and informal proof. In addition to covering all of the key concepts found in traditional trigonometry, pre-calculus, or math analysis courses, it emphasizes several big ideas that form a foundation for calculus and other college mathematics curricula.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 73,
      "code": "697105",
      "name": "Geometry-Algebra Ii Course 1",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 10. Prerequisite: Algebra I with a grade B or higher. Meets the \"C\" UC/CSU Requirement for Mathematics. This is the \ufb01rst course of a two-course sequence during which students will complete California State Standards for three courses (Geometry, Algebra 2 and Precalculus) over a two-year period. The \ufb01rst portion of this course includes a study of plane, solid, coordinate, and transformational geometry. Students explore the formal deductive mathematical system using fundamental concepts of mathematical logic. The concepts of mathematical proof, as well as deductive and inductive thinking, are emphasized as they apply to geometry. The course includes study of proof, logic, angles, circles, perimeter, area, volume, perpendicular and parallel properties, congruence, polygons, similarity, right triangles, geometric probability, and transformational geometry. Following the completion of geometry concepts, students\u2019 progress to an exploration of the real number system with extension into the complex numbers. Students analyze and formulate appropriate solutions, manipulate algebraic expressions to put them in more useful forms.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 74,
      "code": "697107",
      "name": "Algebra Ii-Precalculus Course 2",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 11. Prerequisite: Geometry-Algebra II: Course 1 with a grade C or higher. Meets the \"C\"",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 75,
      "code": "697205",
      "name": "Calculus",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Completion of Pre-Calculus with a grade of C or higher. Meets the \"C\" UC/CSU Requirement for Mathematics. This calculus course is primarily concerned with developing the students\u2019 understanding of the concepts of calculus and providing experiences that solidify understanding of its methods and applications. The course will be taught using a multi-representational approach to calculus with concepts, results, and problems being expressed graphically, numerically, analytically, and verbally. The connections among these representations also are important. Through the use of the unifying themes of derivatives, integrals, limits, approximation, applications, and modeling, the course becomes a cohesive whole rather than a collection of unrelated topics.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 76,
      "code": "697145",
      "name": "Ap Statistics",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 11, 12. Highly recommended: B or better in Algebra II. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the \"C\" UC/CSU Requirement for Mathematics. 38",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 77,
      "code": "697230",
      "name": "Ap Calculus Ab",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Highly recommended: Completion of Pre-Calculus with a grade of C or higher.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 78,
      "code": "697240",
      "name": "Ap Calculus Bc",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Highly recommended: Completion of Honors Pre-Calculus with a grade of C or higher. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the \"C\"",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 79,
      "code": "697038",
      "name": "Multivariable Calculus",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 12. Prerequisite: Completion of Calculus BC with a grade of B or higher in both semesters. Meets the \"C\" UC/CSU Requirement for Mathematics. This course is intended for those who intend to go on to pursue a degree in mathematics or engineering. It is meant to deepen a student\u2019s understanding of calculus concepts and have them be able to apply this knowledge to functions of multiple variables. Since there is no AP exam for the class, it is recommended that students who enroll should attempt to earn credit by examination through the college they decide to attend.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 80,
      "code": "697370",
      "name": "Ap Computer Science A",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 10, 11, 12. Highly recommended: Completion of Computer Science with a grade of B or better or instructor approval. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the \"C\" UC/CSU Requirement for Math.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 81,
      "code": "737500",
      "name": "\nScience\nLife Science\nBiology",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Completion of one year or concurrent enrollment in Algebra I. Meets the UC/CSU \"D\" Requirement for Science. This is a \ufb01rst-year course that is designed to introduce students to the study of living organisms and the past and present relationships between them. The topics to be studied include the application of the scienti\ufb01c process, the interdependence of living organisms and their environments, the relationship between structure and function in cells, how traits are determined and passed on, and how organisms and populations change over time. Laboratory activities, projects and collaborative work will be used to support student learning.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 82,
      "code": "737400",
      "name": "Principles Of Biomedical Science",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. First course in Project Lead the Way sequence. Open to grades 9, 10, 11, 12 Prerequisite: Biology taken concurrently or in a prior year. Meets the UC/CSU \"D\" Requirement for Science. Principles of Biomedical Science is intended to serve as a foundation course within the Project Lead the Way Biomedical course sequence. All of the topics learned in this course will be used in future courses. Students investigate various health conditions including heart disease, diabetes, sickle-cell disease, hypercholesterolemia, and infectious diseases. They determine the factors that led to the death of a \ufb01ctional person, and investigate lifestyle choices and medical treatments that might have prolonged the person\u2019s life. The activities and projects introduce students to human physiology, medicine, and research processes.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 83,
      "code": "772122",
      "name": "Honors Human Body Systems",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Second course in Project Lead the Way sequence. Open to grades 10, 11, 12. Prerequisite: C or better in Principles of Biomedical Science (Recommended). Meets the UC/CSU \"D\" Requirement for Science. Students examine the interactions of body systems as they explore identity, communication, power, movement, protection, and homeostasis. Students design experiments, investigate the structures and functions of the human body, and use data acquisition software to monitor body functions such as muscle movement, re\ufb02ex and voluntary action, and respiration. Exploring science in action, students build organs and tissues on a skeletal mannequin, work through interesting real world cases, and often play the role of biomedical professionals to solve medical mysteries.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 84,
      "code": "751272",
      "name": "Honors Medical Interventions",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Third course in Project Lead the Way sequence. Open to grades 11, 12. Prerequisites: C or better in Principles of Biomedical Sciences or Honors Human Body Systems. Meets the UC/CSU \"D\" Requirement for Science. Students follow the life of a \ufb01ctitious family as they investigate how to prevent, diagnose, and treat disease. Students explore how to detect and \ufb01ght infection; screen and evaluate the code in human DNA; evaluate cancer treatment options; and prevail when the organs of the body begin to fail. Through real-world cases, students are exposed to a range of interventions related to immunology, surgery, genetics, pharmacology, medical devices, and diagnostics.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 85,
      "code": "737740",
      "name": "Anatomy And Physiology",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 11, 12. Recommended: Biology or Chemistry with a grade of B or better. Meets the UC/CSU \"D\" Requirement for Science. Students will study the major human body systems and how anatomical structure relates to physiological function. Laboratory dissection will be required, including a six week comparative anatomy dissection using the cat. This course will also focus on career planning, the development of e\ufffdective communication skills, and preparation for a career in a health 42",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 86,
      "code": "737730",
      "name": "Biotechnology",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. (VHS Only) Open to grades 10, 11, 12. Prerequisite: Completion of Biology with a grade of B or better, and Chemistry or Physical Science with a grade of C or better or concurrent enrollment. Meets the UC/CSU \"D\" Requirement for Science. Biotechnology is a lab-intensive course designed to combine molecular biology with practical applications. Students will be exposed to DNA \ufb01ngerprinting, gene mapping, electrophoresis and DNA spooling, as well activities that relate biotechnology to daily life. Students will also have the opportunity to address social and ethical issues surrounding biotechnology. This course o\ufffders the student an opportunity to experience the basics of microbiology, human genetics, biotechnology, and exploration of bioethical issues. This course will encourage students to take more science in high school. Students will learn valuable skills that are transferable to biotechnology-related technical \ufb01elds and get on-the -job experience through a coordinated mentorship program in partnership with local biotechnology-related companies. This course will be an elective option for students in the Health and Biosciences Academy.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 87,
      "code": "737570",
      "name": "Zoology",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Prerequisite: Completion of Biology with a grade of C or better. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 88,
      "code": "737450",
      "name": "Ap Biology",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 10, 11, 12. Highly recommended: Completion of Biology and Chemistry with a grade of B or better. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 89,
      "code": "751665",
      "name": "Ap Environmental Science",
      "subject": "2024-2025",
      "level": "HP",
      "description": "Open to grades 11, 12. Highly recommended: Completion of two years of high school science - one year of life science and one year of physical science. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). AP Environmental Science meets the UC/CSU \"D\" Requirement for Science. The AP Environmental Science course is a full-year high school course designed to be the equivalent of a one-semester, introductory college course in environmental science. This course has been developed to stress scienti\ufb01c principles and analysis, including laboratory components incorporating knowledge from biology, chemistry, physics and the earth sciences. The course o\ufffders a unique combination of laboratory and \ufb01eldwork through a lens of how human activities integrate into the natural systems of the Earth. Students will study both outdoors and in class. Critical thinking and the construction of solid arguments will explore the many sides of the issues our populations face as more people are required to share fewer resources. The skills required for the course are often learned in seemingly disparate subjects. The breadth of students' academic skills are integrated to examine and explore how our presence and cultural choices impact the natural systems which we all rely upon for our survival and wellbeing.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 90,
      "code": "737300",
      "name": "\nEarth And Space Science",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Completed or concurrent enrollment in Algebra (or the equivalent). Meets the UC/CSU \"D\" Requirement for Science. This is an introductory science course combining Next Generation Science Standards from Earth & Space Science and Physical Science. This course will cover general topics like Earth\u2019s structure, Earth\u2019s dynamic geologic processes, California Geology, climate and meteorology, basic astronomy, formation of the Solar System, properties of elements, and impacts associated with resource use and consumption. It is designed to help students develop an understanding of the natural processes that shape the world around them. A primary emphasis of the class will be on the interaction between Earth's global systems and humans. Students will focus on scienti\ufb01c problems and propose and design solutions to the broader scienti\ufb01c challenges that are being encountered by human society.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 91,
      "code": "737660",
      "name": "Chemistry",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Completion of Algebra (or the equivalent) with a grade of C or better. Meets the UC/CSU \"D\" Requirement for Science. Chemistry deals with the nature of matter in our world. This course ties basic chemistry principles to everyday experiences. Students will gain insight into the interdisciplinary and the thematic nature of chemistry. The topics include the atomic model of matter, molecular structure, bonding, chemical reactions, stoichiometry, states of matter, solutions, acids and bases, thermodynamics, and chemical equilibrium. Laboratory experiments and demonstrations are used to introduce and support concepts. Mathematical reasoning, including basic algebra, are utilized throughout the course.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 92,
      "code": "737700",
      "name": "Physics",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Prerequisite: Completion of Algebra and Geometry (or the equivalent) with a grade of B or better. Recommendation: Completion of Algebra II and concurrent enrollment in Pre-Calculus. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 93,
      "code": "737680",
      "name": "Ap Chemistry",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 11, 12. Highly recommended: Completion of Chemistry and Algebra II with a grade of B or better. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 94,
      "code": "737690",
      "name": "Ap Physics C: Mechanics",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One semester course. Open to grades 11, 12. Concurrent enrollment in AP Physics C: Electricity and Magnetism required. Highly recommended: Completion of Physics with at least a B or better and concurrent enrollment in Calculus or AP Calculus. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 95,
      "code": "737698",
      "name": "\nAp Physics C: Electricity And Magnetism",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One semester course. Open to grades 11, 12. Concurrent enrollment in AP Physics C: Mechanics required. Highly recommended: Completion of Physics with at least a B or better and concurrent enrollment in Calculus or AP Calculus. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the UC/CSU \"D\" Requirement for Science. This course explores the topics of electrostatics; conductors, capacitors, and dielectrics; electric circuits; magnetic \ufb01elds; and electromagnetism. Introductory di\ufffderential and integral calculus is used throughout the course. This course prepares the student for the AP Physics C: Electricity & Magnetism Examination administered annually in May. 45",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 96,
      "code": "748330",
      "name": "\nSocial Science\nEthnic Studies",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-semester course. (AVHS Only) Open to grade 9. Meets the UC/CSU \"A\" Requirement for History/Social Science. This is a one semester course that is required of all ninth grade students, with course variations o\ufffdered for sheltered and",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 97,
      "code": "748450",
      "name": "World History",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 10. Meets the UC/CSU \"A\" Requirement for History/Social Science. The tenth-grade course covers a period of more than 250 years and highlights the intensi\ufb01cation of a truly global history as people, products, diseases, knowledge, and ideas spread around the world as never before. The course begins with a turning point: the important transition in European systems of governance from divine monarchy to a modern de\ufb01nition of a nation-state organized around principles of the Enlightenment. The course ends with the present, providing ample opportunities for teachers to make connections to the globalized world in which students live.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 98,
      "code": "748310",
      "name": "Ap World History",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grade 10. Highly recommended: Completion of Global Studies or Ethnic Studies with a grade of A.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 99,
      "code": "748533",
      "name": "Honors World History",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. (FHS Only) Open to grade 10. Recommendation: Completion of Global Studies or Ethnic Studies with a grade of A. Summer coursework may be required. Meets the UC/CSU \"A\" Requirement for History/Social Science. This is a 10th grade course designed to primarily cover the major events and revolutions that occurred in the last 250 years, which cascade into the modern world today. Although there is an overview of the human civilization as a whole, dating back over 10,000 years of history, this is primarily to include the diversity of experiences and contributions of countless cultures on our planet, and to widen our course from being strictly a Euro-centric study. The course emphasizes the domino e\ufffdect of 18th-19th century revolutions, both political and technological, to lead into the large-scale wars, upheavals, and 46",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 100,
      "code": "748180",
      "name": "Us History",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 11. Meets the UC/CSU \"A\" Requirement for History/Social Science. The 11th grade US History course is focused on modern American history, with a particular focus on the 20th century. The course begins with an overview of the time preceding the 20th century with an emphasis on the nation\u2019s founding ideals. 20th century content includes (but is not limited to) the culture of the 1920s, the Great Depression and New Deal, World War",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 101,
      "code": "748200",
      "name": "Ap Us History",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grade 11. Highly recommended: Completion of World History with a grade of A, Honors World History with a grade of B or higher, or AP World History with a grade of C or higher. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Summer coursework may be required. AP US History course will prepare the student for passing the Advanced Placement US History exam. Meets the UC/CSU \"A\" Requirement for History/Social Science. In AP U.S. History students investigate signi\ufb01cant events, individuals, developments, and processes in nine historical periods from approximately from pre-1492 to the 21st century. Students develop and use the same skills, practices, and methods employed by historians: analyzing primary and secondary sources; developing historical arguments; making historical comparisons; and utilizing reasoning about contextualization, causation, and continuity and change over time. The course also provides eight themes that students explore throughout the course in order to make connections among historical developments in di\ufffderent times and places: American and national identity; migration and settlement; politics and power; work, exchange, and technology; America in the world; geography and environment; and culture and society.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 102,
      "code": "748220",
      "name": "Civics",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-semester course. Open to grade 12. Meets the UC/CSU \"A\" Requirement for History/Social Science. Civics is a required one-semester course for seniors. The course is designed to give students the opportunity to better understand how government works, the dynamic and exciting processes, and how it impacts each student. Units of study will include democracy, federalism, elections and politics, a study of the three branches of government, state and local government, comparative government, civil liberties and civil rights.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 103,
      "code": "748260",
      "name": "Economics",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-semester course. Open to grade 12. Meets the UC/CSU \"G\" Requirement for Electives. This course begins with economic concepts of scarcity and opportunity cost. Supply and demand essentials will be analyzed by students. Personal \ufb01nance concepts such as budgeting, savings, and investments will be highlighted. Additionally, there is a focus on both Macro and Micro economics. Students will be grappling with monetary policy, \ufb01scal policy, and issuers around taxation.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 104,
      "code": "748445",
      "name": "Emphasis",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grade 12. Prerequisite: Enrollment by application/interview. Summer coursework may be required. Taken in conjunction with AP U.S. Government and Politics (\u201cWe, the People\u201d emphasis). Meets the UC/CSU \"A\" Requirement for History/Social Science. This year-long honors government course prepares highly-motivated students to participate in the national \u201cWe the People\u201d competition, sponsored by the Center for Civic Education. Students will complete extensive summer work covering all areas of government, complete the Center\u2019s coursework pertinent to the competition, and participate in several rounds of mock Congressional hearings using materials provided by the Center. Students will compete on the District, Regional, State, and National levels in this competition. This course is designed to give students a critical perspective on the Constitution, government, and politics of the United States.This course involves both the studies of general concepts used to interpret U.S policies and the analysis of speci\ufb01c case studies. It also requires familiarity with the various institutions, groups, beliefs, and ideas that make up the American political reality. 47",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 105,
      "code": "748320",
      "name": "\nAp United States Government And Politics/Ap Macroeconomics",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 10, 11, 12. Highly recommended: Completion of prior Social Science course with a grade of B or better. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). AP Human Geography presents high school students with the curricular equivalent of an introductory college-level course in human geography or cultural geography. Meets the UC/CSU \"A\" Requirement for History/Social Science.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 106,
      "code": "748380",
      "name": "Ap Psychology",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 11, 12. Highly recommended: Completion of prior Social Science course with a grade of B or better. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 107,
      "code": "697260",
      "name": "International Relations",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12 Prerequisite: RS Math 8 or SDC Math. Topics include quantities and modeling, functions, equations and inequalities, statistical models in one and two variables, linear systems and piecewise de\ufb01ned functions, exponential relationships, polynomial operations, quadratic functions and modeling, and inverse relationships.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 108,
      "code": "624010",
      "name": "\nVisual And Performing Arts\nVisual Arts\nArt 1",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. This course introduces students to major periods in the history of art, the elements of art, the principles of design, and basic art vocabulary through projects and assignments using a variety of media and a sequenced approach to instruction. Observation of forms in the natural and human environments and artwork using these forms will be the basis for understanding design and composition. Using both verbal and written forms of expression, students will view, describe, interpret and analyze work of the cultures, artists and art movements whose ideas have most shaped the visual arts today. Students will also learn to describe, analyze and evaluate their own artwork and the artwork of other students. Students will do some research into careers in \ufb01ne and commercial art. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 109,
      "code": "624011",
      "name": "Art 2",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Prerequisite: Completion of Art 1. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Advanced art students will continue their exploration of artistic perception, art production, art history and aesthetic valuing introduced in Art 1. Students will deepen their understanding of the Elements of Art and Principles of Design through structured, academic studies. Students will be expected to apply previously taught concepts in new and innovative ways. The curriculum emphasizes challenging, open-ended artistic problems requiring independent creative thinking. Using both verbal and written forms of expression, students will view, describe, interpret and analyze work of the cultures artists and art movements whose ideas have most shaped the visual arts today. Students will also learn to describe, analyze, evaluate, and defend their artwork and the artwork of others. Students will research careers in \ufb01ne and commercial art. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 110,
      "code": "624015",
      "name": "Art 3",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: Completion of Art 2. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Advanced Art students will continue their exploration of artistic perception, art production, art history and valuing art. Part of the program includes a student and teacher collaborative that writes a series of assignment (unit) contracts targeted to speci\ufb01c areas of interest to the student. These areas may include, but are not limited to, \ufb01ne arts, commercial arts, museum or gallery management or some other area of career interest. Each contract will involve a topic, selected goals which advance the student\u2019s artistic perception, art production skills, knowledge of historical background of topic and strategies to analyze and evaluate the topic assignment. In each contracted area of study, students will use research skills, writing, presentation techniques, and developing production skills to create an in-depth class presentation of the chosen area. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 111,
      "code": "624350",
      "name": "Photography 1",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course: Open to grades 9, 10, 11, 12. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. This course will begin with an introduction to the basic fundamentals of black and white photography, including digital. Students will learn camera mechanics and handling, correct exposure, processing, printing and composition. Students will be required to analyze and write descriptive responses to all work produced in the class. The class will emphasize hands-on projects but will include tests and quizzes as well as other written work. In addition to traditional photographic processing, students will be given the opportunity to use computers for creating digital images. The course will also explore the history of photography and career opportunities. A lab donation is requested for materials and equipment. 55",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 112,
      "code": "624390",
      "name": "\nPhotography 2",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Prerequisite: Completion of Photography 1. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. This course is designed for the student interested in furthering his/her personal photographic vision. It will require a high degree of independent outside work as well as classroom lab time. A much greater emphasis will also be placed on developing computer skills necessary for image manipulation. Areas of study will include composite photography, still life arrangements, and selective focus, extended time exposures, self-portraits, arti\ufb01cial light and multiple exposures. Self-evaluations including analysis and descriptive reporting will be required. A career search and the exploration of the historical signi\ufb01cance of photography will also be part of the curriculum. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 113,
      "code": "624120",
      "name": "Digital Art",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12 Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. This course incorporates both theoretical and applied knowledge to graphic art and traditional art. This comprehensive program emphasizes the fundamentals of the elements and principles of graphic arts and design. The ability to plan and create original works of art will be developed through research, analysis, and critique. Students will develop integrated skill sets that will empower them to utilize visual design. Students will learn to use Adobe Illustrator, InDesign, and Photoshop. A digital portfolio will be generated that can be used to demonstrate their abilities for college entrance or employment in the visual arts and/or graphic design \ufb01eld. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 114,
      "code": "624210",
      "name": "Ceramics 1",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. This course introduces students to the fundamentals of hand-built and thrown ceramics. Students will analyze and evaluate their work and the work of others using the vocabulary and language unique to visual arts. Students will study a variety of cultures, from the past to the present and gain an understanding of ceramics within diverse historical and cultural contexts. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 115,
      "code": "624250",
      "name": "Ceramics 2",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Prerequisite: Completion of Ceramics 1. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. This course expands on the concepts covered in Ceramics 1, including the fundamentals of hand-built and thrown ceramics. Students will continue to analyze and evaluate their work and the work of others using the vocabulary and language unique to the visual arts. Students will study a variety of cultures, from the past to the present, and gain an understanding of ceramics within diverse historical and cultural contexts. A lab donation is requested for materials and equipment. 56",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 116,
      "code": "624200",
      "name": "\nCeramics 3",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: Completion of Ceramics 2. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Students will continue their exploration of artistic perception, art production, art history and valuing art. The program is driven by the student and teacher collaborating to write a series of assignment contracts targeted to speci\ufb01c areas of interest to the student. The areas of study will expand what was covered in Ceramics 2, including a more advanced and individualized study of hand-built and thrown ceramics. Students will explore the progression of their work thus far and determine an area of concentration for their assignments and projects. Students will continue to analyze and evaluate their work and the work of others using the vocabulary and language unique to the visual arts. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 117,
      "code": "624291",
      "name": "Ap Studio Art 2-D Design",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: Completion of Art 1 or 2. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Students will continue their exploration of artistic perception, art production, art history and valuing art under the parameters of the requirements for the Advanced Placement Studio Art portfolio. The student submits this portfolio for adjudication during the time of the AP testing schedule in May. The student\u2019s goal in taking this course is to experience a college level art program and to develop a portfolio of su\ufffdcient quality to earn credits toward university matriculation. Amador 2-D DESIGN students explore these artistic issues either through black & white darkroom photography or through Digital Art and Graphic Design. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 118,
      "code": "624293",
      "name": "Ap Studio Art 3-D Design",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: Completion of Ceramics 1 or 2 and concurrent enrollment with portfolio review. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Students will continue their exploration of artistic perception, art production, art history and valuing art under the parameters of the requirements for the Advanced Placement Studio Art portfolio. The student submits this portfolio for adjudication during the time of the AP testing schedule in May. The student\u2019s goal in taking this course is to experience a college level art program and to develop a portfolio of su\ufffdcient quality to earn credits toward university matriculation. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 119,
      "code": "624283",
      "name": "Ap Studio Art Drawing",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: Completion of Art 1 or 2. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Students will continue their exploration of artistic perception, art production, art history and valuing art under the parameters of the requirements for the Advanced Placement Studio Art portfolio. The student submits this portfolio for adjudication during the time of the AP testing schedule in May. The student\u2019s goal in taking this course is to experience a college level art program and to develop a portfolio of su\ufffdcient quality to earn credits toward university matriculation. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 120,
      "code": "624100",
      "name": "Ap Art History",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. (FHS only) Open to grades 11, 12. Highly Recommended: College-level reading, writing and research skills.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 121,
      "code": "624310",
      "name": "\nVideo Production 1",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: One-year of visual and performing arts. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Students learn basic composition and will learn to integrate narrative, audio and visual elements into a series of production assignments. During the course of the year, students will build skills in the following three areas of production: pre-production, including planning, storyboarding and scriptwriting; production, including \ufb01lming, audio recording and lighting; and post-production, including editing, critique and animation. Students will be expected to develop a sense of professional behavior and ethics as they learn about intellectual property rights and responsibilities as well as career opportunities. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 122,
      "code": "624320",
      "name": "Video Production 2",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Prerequisite: Completion of Video Production 1 OR approval of instructor. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Students continue learning composition and will learn to integrate narrative, audio and visual elements into a series of production assignments. During the course of the year, students will build skills in the following three areas of production: pre-production, including planning, storyboarding and scriptwriting; production, including \ufb01lming, audio recording and lighting; and post-production, including editing, critique and animation. Students will be expected to develop a sense of professional behavior and ethics as they learn about intellectual property rights and responsibilities as well as career opportunities. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 123,
      "code": "624300",
      "name": "Video Production 3",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: Completion of Video Production 2. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Students learn more advanced composition and will learn to integrate narrative, audio and visual elements into a series of production assignments. During the course of the year, students will build skills in the areas of production outlined in Video Production 1 and 2. Additionally, students will learn motion graphic creation, audio production and editing and DVD authoring. Students will be expected to develop a sense of professional behavior and ethics as they learn about intellectual property rights and responsibilities as well as career opportunities. A lab donation is requested for materials and equipment.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 124,
      "code": "704843",
      "name": "Concert Choir",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Course may be repeated for credit. One year meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. (Large Ensemble) Singers receive instruction in vocal technique, reading music and basic music theory. A variety of choral literature, music styles and periods, both sacred and secular, are presented. Students learn stylistic interpretation, as well as development of vocal and musical skills. Open to piano accompanists with audition. Weekend tours may occur as well as clinics, music festivals, evening rehearsals and performances. All performances are mandatory.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 125,
      "code": "704830",
      "name": "Treble Choir",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. (FHS only) Open to grades 10, 11, 12. Course may be repeated for credit. Prerequisite: Vocal and musical skills audition. One year meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. (Small Ensemble) Singers receive intermediate-level instruction in voice, reading music and basic music theory. A variety of treble choral literature, music styles and periods, both sacred and secular, are presented. Students learn stylistic interpretation, as well as development of vocal and musical skills. Most music sung in class will be used for performances. Open to piano accompanists with audition. Weekend tours may occur as well as clinics, music festivals, evening rehearsals and performances. All performances are mandatory.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 126,
      "code": "704840",
      "name": "Chamber Choir",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Course may be repeated for credit. Prerequisite: Vocal and musical skills audition. One year meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. 58",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 127,
      "code": "704820",
      "name": "Vocal Jazz Ensemble",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Course may be repeated for credit. Prerequisite: At least one year of Choir or Jazz Band, audition based, concurrent enrollment in a large ensemble (instrumental or vocal). One year meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Vocal Jazz Ensemble is an audition-based classroom ensemble, in which students will receive advanced instruction in jazz history, music theory, jazz composition, vocal and instrumental technique, solo transcription and improvisation, arranging, and performance skills. Students will also learn to run a sound system, and recording basics. Students will learn advanced jazz-based repertoire, with diverse selections of language, style, arrangers, and composers, some of which will be performed with jazz instrumentalists from within the instrumental music department. Weekend tours may occur as well as clinics, music festivals, evening rehearsals, and performances. All performances are required.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 128,
      "code": "644501",
      "name": "Drama 1",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Students learn the basics of dramatic performing, technical theatre and gain exposure to some historical drama. Students will learn the foundations of performance, improvisation, technical theatre, voice, diction and movement. Students will complete a variety of performances and written assignments that will demonstrate practical and critical thinking skills and performance criteria.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 129,
      "code": "644502",
      "name": "Drama 2",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Prerequisite: Completion of Drama 1 or instructor approval. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. This performance-oriented course is designed to allow the experienced performer to practice his/her skills with more complex acting styles and materials. This course covers backstage and technical aspects of theater, the study of Shakespeare\u2019s comedic style, and research, rehearsal and performance of contemporary scenes and monologues. Students are required to see one live theater performance each semester.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 130,
      "code": "644505",
      "name": "Advanced Drama",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 11, 12. Course may be repeated for credit. Prerequisite: Completion of Drama 1 and 2. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. This class is for the serious drama student and is a continuation of the skills and projects learned in beginning and intermediate drama, with additions in the area of \ufb01lm studies and career preparation in the acting/production industries. Outside hours for internships in the community and school productions will be required of the student.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 131,
      "code": "644508",
      "name": "Theatre Production",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. (AVHS Only) Open to grades 9, 10, 11, 12. Course may be repeated for credit. Meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. This course is centered around theatre design and script analysis in conjunction with learning stage craft technique. Students learn to design and build sets, costumes, lights, and sound for the theatre. This is hands-on experience in all theatrical production elements, with much of the work being used for Amador Drama productions. Students are required to complete 20 hours of outside technical production hours over the entire year. Students will also need to see one live theater performance and write a production critique each semester.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 132,
      "code": "704640",
      "name": "Concert Band",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 9. Course may be repeated for credit. Recommended: previous experience on a symphonic band musical instrument. Instructor approval. One year meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. 59",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 133,
      "code": "704610",
      "name": "Percussion Band",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. (FHS Only) Open to grades 9, 10, 11, 12. Course may be repeated for credit. Prerequisite: Basic knowledge of percussion instruments and techniques. Instructor approval required. Under regular circumstances, students will be concurrently enrolled in Marching Band and Percussion Band. However, individual exceptions may be made for students with schedule con\ufb02icts or other individual circumstances which may make ful\ufb01lling this requirement unfeasible for the student. One year meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Percussion is a performance-oriented class with an emphasis on percussion instruments and techniques. Students will learn music terminology, music reading skills and ensemble performance techniques as it relates to percussion. Literature will include concert band, large ensemble, small ensemble and marching arrangements. Performances may include a winter and spring concert, outdoor pageantry events, and small ensemble festivals. Attendance is required at all performances.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 134,
      "code": "704860",
      "name": "Color Guard",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Course may be repeated for credit. prerequisite: Instructor approval required. One year meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. Ten units of the required twenty units in P.E. may be satis\ufb01ed in the music department. All students must complete PE Course 1 freshman year. This is a performance-oriented class designed to allow students to learn movement through dance. Students will also learn to use props and equipment (\ufb02ags, ri\ufb02es, sabers) in a way that will enhance and supplement the school\u2019s marching band program. The color guard will also learn and perform a competitive show that allows them to combine the qualities of dance and athleticism in a unique blend.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 135,
      "code": "704585",
      "name": "Symphonic Band",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Course may be repeated for credit. Recommended: previous experience on a symphonic band musical instrument. Instructor approval. One year meets the UC/CSU \"F\" Requirement for Visual and Performing Arts.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 136,
      "code": "704580",
      "name": "Wind Ensemble",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Course may be repeated for credit. Prerequisite: Students must have previous experience on a symphonic band musical instrument. Instructor approval and audition are required to enroll in class. The audition will include a prepared solo, knowledge of all major minor scales, arpeggios, rhythm, and sight reading. Knowledge of musical terminology is required. One year meets the UC/CSU \"F\" Requirement for Visual and Performing Arts.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 137,
      "code": "704880",
      "name": "String Orchestra",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Course may be repeated for credit. Prerequisite: A minimum of two years of playing experience and instructor approval or audition. One year meets the UC/CSU \"F\" Requirement for Visual and Performing Arts. String Orchestra is a performance-based class designed for students with experience on violin, viola, cello, bass, or piano. String and full orchestra music from all major music periods will be rehearsed, analyzed, and performed. Music theory and music history are components of this class. The orchestra will perform at festivals, concerts, and community events throughout the year. Attendance at performances is a required portion of the class.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 138,
      "code": "704885",
      "name": "Symphony Orchestra",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Course may be repeated for credit. Prerequisite: Completion of String Orchestra, a minimum of three years of playing experience, and instructor approval or audition. One year meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 139,
      "code": "704900",
      "name": "Ap Music Theory",
      "subject": "Performing Arts",
      "level": "HP",
      "description": "One-year course. Open to grades 11, 12. Recommended prerequisite: Two years of playing experience and concurrent enrollment in a band, orchestra, or choir course; or instructor approval. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). One year meets the UC/CSU \"F\" Requirement for Visual and Performing Arts.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 140,
      "code": "665495",
      "name": "American Sign Language I",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Meets the UC/CSU \"E\" Requirement for a Language Other than English. This course covers the beginning fundamental principles of American Sign Language (ASL) and introduces basic information about the Deaf community and Deaf culture. It covers basic ASL skills, both receptive (seeing and understanding) and expressive (signing) as well as basic conversation skills, emphasizing vocabulary building and correct use of signs. ASL, sometimes referred to as \u201cthe language of the deaf\u201d, will be particularly useful to persons with an interest in better, more e\ufffdective communications with deaf individuals, and for those interested in eventually interpreting, teaching, and/or working with the deaf and hard of hearing communities.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 141,
      "code": "665500",
      "name": "American Sign Language Ii",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Completion of ASL I with a grade of C- or better. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 142,
      "code": "665510",
      "name": "American Sign Language Iii",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: Completion of ASL II with a grade of C- or better. Meets the UC/CSU \"E\" Requirement for a Language Other than English. This course focuses on translation with the ability to interpret any written story. The student will also begin to work on voice-translation as well as build on receptive skills in the language. Involvement in the deaf community is strongly encouraged in order to build vocabulary through socialization in the deaf community. Total class participation is required in order to do well in the class.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 143,
      "code": "665515",
      "name": "American Sign Language Iv",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: Completion of ASL III with a grade of C- or better. Meets the UC/CSU \"E\" Requirement for a Language Other than English. This course covers the in-depth exposure and comparative analysis of the Deaf social and linguistic experience using American Sign Language. ASL will be particularly useful to persons with an interest in better, more e\ufffdective communications with deaf individuals, and for those interested in eventual interpreting, teaching, and/or working with the deaf and hard of hearing communities.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 144,
      "code": "665000",
      "name": "French I",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Grade of C or better in prior year English course. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 145,
      "code": "665020",
      "name": "French Ii",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Grade of C- or better in French I. Meets the UC/CSU \"E\" Requirement for a Language Other than English. French II is a communication-based foreign language course in which the students will listen, speak, read and write at an intermediate level. Students will expand their knowledge of French-speaking populations and cultures. In this course, students will further develop their ability to comprehend, write, and communicate socially in the target language.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 146,
      "code": "665040",
      "name": "French Iii",
      "subject": "Performing Arts",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Grade of C- or better in French II. Meets the UC/CSU \"E\" Requirement for a Language Other than English. French III is a communication-based foreign language course in which the students will listen, speak, read and write at an intermediate level. Students will expand their knowledge of French-speaking populations and cultures. In this course, students will further develop their ability to comprehend, write, and communicate socially in the target language.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 147,
      "code": "665065",
      "name": "Ap French Language And Culture",
      "subject": "Performing Arts",
      "level": "HP",
      "description": "One-year course. Open to grades 10, 11, 12. Prerequisite: Grade of B or better in French III. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the UC/CSU \"E\" Requirement for a Language Other than English. This course takes a holistic approach to language pro\ufb01ciency and recognizes the complex interrelatedness of comprehension and comprehensibility, vocabulary usage, language control, communication strategies, and cultural awareness. Students learn language structures in context and use them to convey meaning. In order to best facilitate the study of language and culture, the course is taught in the target language. This course prepares the student for the AP French Language and Culture Examination given in May, for which the student may receive college credit. 65",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 148,
      "code": "665085",
      "name": "\nFrench V Honors",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: Grade of B or better in AP French Language IV. Meets the UC/CSU \"E\" Requirement for a Language Other than English. This course is designed for students wanting to continue their study of French. Emphasis will be on literary analysis and interpretation. Students will learn the techniques of literary analysis as well as basic vocabulary of critical terms. Class discussion and essay writing in French will be important components of the course.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 149,
      "code": "665400",
      "name": "Japanese I",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Grade of C or better in prior year English course. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 150,
      "code": "665410",
      "name": "Japanese Ii",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Grade of C- or better in Japanese I. Meets the UC/CSU \"E\" Requirement for a Language Other than English. Japanese II serves as a continuation to the foundation of language and culture of Japan obtained in Japanese I. Through communicative activities, Japanese II will foster the students\u2019 understanding of the language and culture of Japan while also creating an interest in furthering their studies.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 151,
      "code": "665420",
      "name": "Japanese Iii",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 10, 11, 12. Prerequisite: Grade of C- or better in Japanese II. Meets the UC/CSU \"E\" Requirement for a Language Other than English. Students will build upon their communication skills to develop more complex and interactive speaking ability. The course will continue to emphasize listening, speaking, reading and writing skills. As an understanding of Japanese culture is a key element in appreciating the language, culture study will be woven throughout this communication-based course.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 152,
      "code": "665380",
      "name": "Ap Japanese Language And Culture",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: Grade of B or better in Japanese III. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the UC/CSU \"E\" Requirement for a Language Other than English. This course is designed to be comparable to college/university Japanese courses that represent the point at which students complete approximately 300 hours of college-level classroom instruction. Like the corresponding college courses, this course supports students as they develop the productive, receptive, and cultural skills necessary to communicate with native speakers of Japanese. Students\u2019 pro\ufb01ciency levels at the end of the course are expected to reach at least the Intermediate Low to Intermediate Mid-range, as described in the American Council on the Teaching of Foreign Languages (ACTFL) Pro\ufb01ciency Guidelines. This course prepares the student for the AP Japanese Language and Culture Examination given in May, for which the student may receive college credit.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 153,
      "code": "665535",
      "name": "Korean I",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Recommended: Grade of C or better in prior year English course. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 154,
      "code": "665540",
      "name": "Korean Ii",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Recommended: Grade of C or better in prior year English course. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 155,
      "code": "665545",
      "name": "Korean Iii",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Recommended: Grade of C or better in prior year English course. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 156,
      "code": "665550",
      "name": "Iv",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Recommended: Grade of C or better in prior year Korean course. Pending approval to meet the UC/CSU \u201cE\u201d Requirement for a Language Other than English. The Korean IV Honors, recommended for students who completed Korean III with a B or higher, is mainly taught in the target language and focuses on the mastery of advanced levels in reading, writing, listening, speaking, and the advanced development of cultural literacy. Throughout the course, students will not only enhance their comprehension of Korean culture and society, but also develop their ability to gather, synthesize, compare, and contrast information from diverse sources. Engaging in discussions and exchanging opinions on topics of interest will be a key aspect of the course, enabling students to re\ufb01ne their analytical skills. To further strengthen their language pro\ufb01ciency, students will be exposed to a wide range of genres and will actively participate in reading and writing activities, interacting with materials from various sources such as print media and social media. Additionally, students will navigate through more in depth study of culture, history, costumes and lifestyles of Korea utilizing authentic materials and enhance their ability to communicate in target language outside the classroom setting.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 157,
      "code": "665100",
      "name": "Spanish I",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Recommended: Grade of C or better in prior year English course. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 158,
      "code": "665120",
      "name": "Spanish Ii",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Grade of C or better in Spanish I or placement test. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 159,
      "code": "665140",
      "name": "\nSpanish Iii",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Grade of C or better in Spanish II or placement test. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 160,
      "code": "665330",
      "name": "Spanish Language Arts Immersion 9",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. (FHS Only) Open to grade 9. Meets the UC/CSU \"E\" Requirement for a Language Other than English. Spanish Immersion 9 is a college-preparatory course for dual immersion, native and/or heritage speakers. This pre-AP course is intended to be meaningful and challenging to students and connect to real-life situations, their personal experiences, incorporating all four language skills/modalities (listening, speaking, reading, and writing). Additional focus in grammatical and writing skills will be integrated through a variety of authentic texts and resources. This course will continue to develop their bilingualism through high school graduation.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 161,
      "code": "665160",
      "name": "Spanish Iv",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. (AVHS Only) Open to grades 9, 10, 11, 12. Prerequisite: Grade of C or better in Spanish III or placement test. Meets the UC/CSU \"E\" Requirement for a Language Other than English. Spanish IV is a college preparatory course for native speakers, students who have successfully completed Spanish III and wish to further their Spanish studies, and Dual Immersion Program students. The course emphasizes conversational and grammatical skills at an advanced level. Students focus on the verbal and auditory skills in a range of settings and situations for a variety of purposes. Cultural literacy and appreciation of Spanish and Spanish-speaking culture is incorporated into the coursework by sampling Spanish \ufb01ction, literary works of art, recordings, Spanish language television, \ufb01lms, newspapers, magazines, creative writing, reading for information and pleasure, and discussion. Particular attention is given to the teaching of language skills (listening, reading, speaking, and writing) and is instructed through the study of advanced oral and written texts. The course is instructed exclusively in Spanish.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 162,
      "code": "665165",
      "name": "Ap Spanish Language And Culture",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Prerequisite: Grade of B or better in Spanish III. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the UC/CSU \"E\" Requirement for a Language Other than English. This course takes a holistic approach to language pro\ufb01ciency and recognizes the complex interrelatedness of comprehension and comprehensibility, vocabulary usage, language control, communication strategies, and cultural awareness. Students learn language structures in context and use them to convey meaning. In order to best facilitate the study of language and culture, the course is taught in the target language. This course prepares the student for the AP Spanish Language and Culture Examination given in May, for which the student may receive college credit.",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 163,
      "code": "665185",
      "name": "Ap Spanish Literature And Culture",
      "subject": "2024-2025",
      "level": "HP",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Highly recommended: Completion of AP Spanish Language IV with a grade of B or better. AP courses are college-level and may rely on knowledge obtained in recommended prior course(s). Meets the",
      "prerequisites": "",
      "difficulty": 4
    },
    {
      "id": 164,
      "code": "772050",
      "name": "\nAvid 9",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 9. Prerequisite: C or better in 8th Grade AVID, or application and interview process. Meets the UC/CSU \"G\" Requirement for Electives. This course is a college preparatory program for students who are college bound. While concurrently enrolled in a college-prep course of study, students learn strategies to enhance success. The AVID course emphasizes training in",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 165,
      "code": "772070",
      "name": "Avid 10",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 10. Prerequisite: C or better in AVID 9, or application and interview process. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 166,
      "code": "772080",
      "name": "Avid 11",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 11. Prerequisite: C or better in AVID 10, or application and interview process. Meets the",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 167,
      "code": "772090",
      "name": "Avid 12",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grade 12. Prerequisite: C or better in AVID 11. Meets the UC/CSU \"G\" Requirement for Electives. The AVID 12 course is the culmination of a student\u2019s years in the AVID program. As with all AVID courses, the AVID 12 course features tutorials where students participate in study groups to analyze subjects in which they are enrolled. Students also participate in Socratic Seminars, Philosophical Chairs, and other academic activities. AVID 12 students also continue to focus on WICOR (Writing, Inquiry, Collaboration, Organization, and Reading). AVID 12 students work on skills to improve upon his or her performance on college entrance exams and complete college and \ufb01nancial assistance applications with the assistance of the instructor. 70",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 168,
      "code": "770140",
      "name": "Student Leadership",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 9, 10, 11, 12. Course may be repeated for credit. Prerequisite: Application/interview process. Meets the UC/CSU \"G\" Requirement for Electives. The basic objective of the class is to o\ufffder student leaders an opportunity to develop leadership skills as they perform the responsibilities of the position they hold. The class is organized primarily as a workshop and deals with practical class work directly related to the individual's position of leadership, interests and initiative. Emphasis is on the development and completion of projects of bene\ufb01t to the school and community. Students are expected to spend additional time ful\ufb01lling the responsibilities of their position outside of class. Elected and appointed o\ufffdcials are required to enroll in Leadership for the length of the term in which they hold o\ufffdce unless arrangements are made with the instructor prior to the start of the school year.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 169,
      "code": "748390",
      "name": "Student Board Trustee",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 11, 12. Prerequisite: Application/interview process. Meets the UC/CSU \"G\" Requirement for Electives. This is an elective course designed to give students the opportunity to better understand how local educational agencies work, how local governance is a dynamic and exciting process, and how it impacts each student. The Student Board Trustee attends their classes during the week and also attends regular monthly Board meetings. Students must be enrolled full-time as a high school student with good academic standing, attendance, and behavior while enrolled in this elective course. Course grade and credit are earned by completion of the course requirements which include attending school, attending Board meetings, and completing the major units of study listed in this course outline. This course will help students to develop self con\ufb01dence and communication skills, and to actively participate in civic engagement opportunities.",
      "prerequisites": "",
      "difficulty": 3
    },
    {
      "id": 170,
      "code": "632900",
      "name": "General Work Experience",
      "subject": "2024-2025",
      "level": "P",
      "description": "One-year course. Open to grades 11, 12. Course may be repeated for credit. Meets the UC/CSU \"G\" Requirement for Electives. This is an elective class that combines paid employment with classroom instruction. Students attend their jobs during the week and also attend a class session once a week at school. Students must have teacher-approved legal employment while enrolled in this elective. Course grade and credit are earned by completion of the course requirements which include attending class, submitting paycheck stubs, completing class assignments, submitting required forms, and maintaining 71",
      "prerequisites": "",
      "difficulty": 3
    }
  ]
];

// ---------------------
// RESTful Routes
// ---------------------

// In-memory storage for comments (would be a database in production)
const comments = {};

// GET all courses
app.get('/api/courses', (req, res) => {
  // The courses array is nested, so we need to flatten it
  const flattenedCourses = courses.flat();
  res.json(flattenedCourses);
});

// GET a specific course by ID
app.get('/api/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  const flattenedCourses = courses.flat();
  const course = flattenedCourses.find(c => c.id === courseId);
  
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  
  res.json(course);
});

// GET comments for a specific course
app.get('/api/courses/:id/comments', (req, res) => {
  const courseId = parseInt(req.params.id);
  const courseComments = comments[courseId] || [];
  res.json(courseComments);
});

// POST a new comment for a course
app.post('/api/courses/:id/comments', (req, res) => {
  const courseId = parseInt(req.params.id);
  const flattenedCourses = courses.flat();
  const course = flattenedCourses.find(c => c.id === courseId);
  
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  
  const comment = {
    id: Date.now(), // Using timestamp as ID for simplicity
    courseId,
    userName: req.body.userName,
    text: req.body.text,
    date: req.body.date || new Date().toISOString()
  };
  
  // Initialize array if it doesn't exist
  if (!comments[courseId]) {
    comments[courseId] = [];
  }
  
  comments[courseId].push(comment);
  res.status(201).json(comment);
});

// ---------------------
// Start the Server
// ---------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
