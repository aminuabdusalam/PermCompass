// PermCompass educational data. Content is educational only and not legal advice.

const PHASES = [
  {
    id: 'p1',
    number: 1,
    title: 'PERM Assessment + Job Description',
    shortTitle: 'PERM Assessment',
    icon: '📝',
    minMonths: 0.75,
    maxMonths: 1,
    variesByCountry: false,
    terminal: false
  },
  {
    id: 'p2',
    number: 2,
    title: 'Skills Verification + PWD Request',
    shortTitle: 'Skills + PWD',
    icon: '📋',
    minMonths: 0.5,
    maxMonths: 0.75,
    variesByCountry: false,
    terminal: false
  },
  {
    id: 'p3',
    number: 3,
    title: 'PWD from DOL + Signed EVLs',
    shortTitle: 'PWD + EVLs',
    icon: '⏳',
    minMonths: 6,
    maxMonths: 8,
    variesByCountry: false,
    terminal: false
  },
  {
    id: 'p4',
    number: 4,
    title: 'Labor Market Test + PERM Prep',
    shortTitle: 'Recruitment',
    icon: '📢',
    minMonths: 3,
    maxMonths: 5,
    variesByCountry: false,
    terminal: false
  },
  {
    id: 'p5',
    number: 5,
    title: 'PERM Filing',
    shortTitle: 'PERM Filing',
    icon: '📤',
    minMonths: 14,
    maxMonths: 18,
    variesByCountry: false,
    terminal: false
  },
  {
    id: 'p6',
    number: 6,
    title: 'I-140 Filing / Immigrant Petition',
    shortTitle: 'I-140 Petition',
    icon: '📮',
    minMonths: 4,
    maxMonths: 8,
    premiumMonths: 0.5,
    variesByCountry: false,
    terminal: false
  },
  {
    id: 'p7',
    number: 7,
    title: 'Priority Date Wait',
    shortTitle: 'Visa Bulletin',
    icon: '🗓️',
    minMonths: null,
    maxMonths: null,
    variesByCountry: true,
    terminal: false
  },
  {
    id: 'p8',
    number: 8,
    title: 'I-485 / Consular Processing',
    shortTitle: 'I-485 or CP',
    icon: '🧾',
    minMonths: 6,
    maxMonths: 18,
    variesByCountry: false,
    terminal: false
  },
  {
    id: 'p9',
    number: 9,
    title: 'Green Card Issued',
    shortTitle: 'Green Card',
    icon: '🎉',
    minMonths: 0,
    maxMonths: 0,
    variesByCountry: false,
    terminal: true
  }
];

const CATEGORIES = ['EB-2', 'EB-3'],
  COUNTRIES = ['Rest of World', 'India', 'China', 'Mexico', 'Philippines'];

const COUNTRY_WAITS = {
  'Rest of World': {
    'EB-2': { minYears: 0, maxYears: 0.5, note: 'Generally current with occasional short retrogression.' },
    'EB-3': { minYears: 0, maxYears: 0.5, note: 'Generally current.' }
  },
  'India': {
    'EB-2': { minYears: 10, maxYears: 13, note: 'India EB-2 has been heavily retrogressed for years due to per-country caps. Actual wait depends on your priority date and unused visa numbers each fiscal year.' },
    'EB-3': { minYears: 8, maxYears: 11, note: 'India EB-3 has been similarly retrogressed.' }
  },
  'China': {
    'EB-2': { minYears: 4, maxYears: 6, note: 'China EB-2 remains backlogged, with movement tied to monthly Visa Bulletin updates and annual visa supply.' },
    'EB-3': { minYears: 3, maxYears: 5, note: 'China EB-3 is backlogged, though often less severe than India and still subject to monthly movement.' }
  },
  'Mexico': {
    'EB-2': { minYears: 0, maxYears: 1, note: 'Mostly current; occasional short waits.' },
    'EB-3': { minYears: 0, maxYears: 1, note: 'Mostly current with possible brief retrogression in high-demand periods.' }
  },
  'Philippines': {
    'EB-2': { minYears: 0, maxYears: 1, note: 'Mostly current with possible short waits depending on annual demand.' },
    'EB-3': { minYears: 1, maxYears: 3, note: 'Philippines EB-3 has periodically retrogressed.' }
  }
};

const CHAPTERS = [
  {
    id: 'ch0',
    phaseId: null,
    title: 'Employer-Sponsored Green Cards 101',
    icon: '🧭',
    description: 'A practical map of PERM, EB categories, country caps, and the full employment green card journey.',
    content: `<p>An employer-sponsored green card is a path to U.S. permanent residence where the company supports a worker for an employment-based immigrant visa. For many Microsoft employees, the most common track begins with PERM, a Department of Labor process that asks whether there are able, willing, qualified, and available U.S. workers for the offered role.</p>
<h3>Why PERM exists</h3>
<p>PERM is a labor market test, not a test of whether you are good at your job. The employer defines the offered position, obtains a prevailing wage, recruits according to required rules, and files Form ETA 9089 if no qualified U.S. worker is found. After PERM certification, the process moves to USCIS for the I-140 immigrant petition and later the green card application when a visa number is available.</p>
<ul><li><strong>EB-1</strong> often covers extraordinary ability, outstanding researchers, or multinational managers.</li><li><strong>EB-2</strong> generally covers advanced degree roles or exceptional ability roles.</li><li><strong>EB-3</strong> generally covers professional, skilled, or other worker roles.</li></ul>
<div class="info-card accent"><p><strong>Educational disclaimer:</strong> This app explains common process concepts as of mid-2026. It is not legal advice. Always follow guidance from your employer immigration team and counsel.</p></div>
<h3>Why country matters</h3>
<p>Employment-based green cards are limited by category and by per-country caps. Your chargeability country is usually your country of birth, not citizenship. Rest of World cases can finish much faster once PERM and I-140 are complete, while India and China often wait years for a current priority date.</p>`,
    quiz: [
      { q: 'What is the main purpose of the PERM process?', a: ['To test the U.S. labor market for the offered role', 'To issue the physical green card', 'To approve a travel visa', 'To choose between H-1B and L-1 status'], correct: 0, explain: 'PERM is the employer labor market test before many EB-2 and EB-3 immigrant petitions.' },
      { q: 'Which employment-based categories most often use PERM for professional roles?', a: ['EB-4 and EB-5', 'EB-2 and EB-3', 'B-1 and B-2', 'F-1 and J-1'], correct: 1, explain: 'PERM is common for EB-2 and EB-3 professional, skilled, and advanced degree roles.' },
      { q: 'Why can two employees with similar jobs have very different green card timelines?', a: ['Their birth country and category can have different visa backlogs', 'The I-140 always takes ten years', 'USCIS processes every country alphabetically', 'PERM is optional for all employees'], correct: 0, explain: 'Per-country caps and category demand create different priority date waits.' },
      { q: 'What does chargeability usually depend on?', a: ['Country of birth', 'Current office location', 'Passport expiration date', 'Manager work location'], correct: 0, explain: 'Chargeability is usually based on country of birth, with limited exceptions.' }
    ]
  },
  {
    id: 'ch1',
    phaseId: 'p1',
    title: 'Phase 1: PERM Assessment + JD',
    icon: '📝',
    description: 'How the employer and attorney assess eligibility and lock the job description before recruitment.',
    content: `<p>The first phase turns a real job into a PERM-ready offered position. HR and immigration counsel review the role, the employee's background, the likely EB category, and whether the job requirements can be supported as normal for the position. The job description matters because it becomes the foundation for the wage request, recruitment, and Form ETA 9089.</p>
<h3>Your role</h3>
<p>You may be asked to confirm education, prior experience, skills, work locations, and reporting details. You might also review drafts for accuracy. Be careful to distinguish what the job requires from what you personally happen to have. PERM focuses on minimum requirements for the offered role, not a wish list of everything the current employee knows.</p>
<div class="info-card accent"><p><strong>Regulatory line you cannot cross:</strong> U.S. rules prohibit the sponsored employee from being involved in setting the minimum requirements for the position. The employer and counsel work with your manager to define those requirements. Expect to answer factual questions about your background, but do not try to shape what the job asks for.</p></div>
<ul><li><strong>Keep records ready:</strong> degrees, transcripts, prior employment dates, and role descriptions.</li><li><strong>Respond quickly:</strong> early clarifications can prevent later rework.</li><li><strong>Avoid overfitting:</strong> requirements that look tailored to one person can create audit risk.</li></ul>
<div class="key-terms"><h3>Key Terms</h3><dl><dt>Job Description</dt><dd>The employer's statement of duties, requirements, location, and minimum qualifications for the offered role.</dd><dt>PERM Assessment</dt><dd>The early legal and factual review to decide whether the role can support a PERM case.</dd></dl></div>
<p>This phase is usually measured in weeks. The goal is not to rush past details, but to define a consistent role that can survive later review by the Department of Labor.</p>`,
    quiz: [
      { q: 'How long is Phase 1 expected to take in this tracker?', a: ['3 to 4 weeks', '6 to 8 months', '14 to 18 months', '8 to 11 years'], correct: 0, explain: 'The source timeline gives 3 to 4 weeks for PERM assessment and job description finalization.' },
      { q: 'Why is the job description so important?', a: ['It anchors the wage request, recruitment, and PERM form', 'It replaces the I-140 petition', 'It determines passport validity', 'It removes the need for EVLs'], correct: 0, explain: 'The PERM record must stay consistent from job description through filing.' },
      { q: 'Which requirement can increase PERM risk?', a: ['A requirement that appears tailored to only the sponsored employee', 'A clear minimum education requirement', 'A supported work location', 'A consistent list of core duties'], correct: 0, explain: 'Overly tailored requirements can make recruitment and audit review harder.' },
      { q: 'What should an employee do during this phase?', a: ['Provide accurate background information and review details promptly', 'Contact DOL directly for a wage', 'File Form I-485', 'Skip attorney questionnaires'], correct: 0, explain: 'Employee accuracy and responsiveness help counsel build a clean record.' },
      { q: 'Who is allowed to set the minimum requirements for the sponsored position?', a: ['The employer and immigration counsel, working with your manager', 'The sponsored employee', 'The Department of Labor', 'The former employer'], correct: 0, explain: 'U.S. regulations prohibit the sponsored employee from being involved in setting the minimum requirements for the position.' }
    ]
  },
  {
    id: 'ch2',
    phaseId: 'p2',
    title: 'Phase 2: Skills Verification + PWD Request',
    icon: '📋',
    description: 'What skills checks, employment letters, and the prevailing wage request are trying to prove.',
    content: `<p>After the role is shaped, counsel verifies that the employee appears to meet the offered job's minimum requirements before the employer files the prevailing wage request. This can include education review, experience review, and drafts of employment verification letters, often called EVLs.</p>
<h3>Employment verification letters</h3>
<p>EVLs usually come from prior employers and confirm dates, title, hours, duties, and skills. They are important because the employer must show that the sponsored worker met the requirements before moving into the offered role, unless a narrow exception applies. Drafts should be factual, specific, and consistent with the resume and PERM requirements.</p>
<p><strong>You are responsible for getting the EVLs signed by your former managers</strong> and returning them to the immigration team. The case cannot move into the recruitment round until counsel has confirmation that you can obtain the required EVLs. Original signed letters may arrive later in the process, but you must confirm feasibility to unblock Phase 3.</p>
<h3>Prevailing wage request</h3>
<p>The prevailing wage determination, or PWD, asks the Department of Labor to identify the required minimum wage for the offered job in the location. The employer submits details about duties, requirements, location, and other role facts. This tracker estimates Phase 2 at 2 to 3 weeks because the request preparation and attorney review of EVLs are short, while the DOL wage response arrives in the next phase.</p>
<div class="info-card"><p><strong>Practical tip:</strong> Keep old manager contacts, HR portals, pay records, and job descriptions organized. EVL collection is often slower when former employers have changed systems or policies.</p></div>
<p>Accuracy is more important than flowery language. A strong EVL clearly connects past work to the skills and experience required by the sponsored position.</p>`,
    quiz: [
      { q: 'What does EVL stand for in this process?', a: ['Employment Verification Letter', 'Electronic Visa License', 'Employer Visa Ledger', 'Estimated Validation Limit'], correct: 0, explain: 'EVLs document prior employment details used to support the PERM requirements.' },
      { q: 'What does the PWD establish?', a: ['The required minimum wage for the offered job', 'The employee priority date', 'The green card expiration date', 'The number of dependents on the case'], correct: 0, explain: 'The Department of Labor uses the PWD to set the prevailing wage for the role and location.' },
      { q: 'How long is Phase 2 estimated to take?', a: ['2 to 3 weeks', '3 to 5 months', '4 to 8 months', '10 to 13 years'], correct: 0, explain: 'The tracker uses 2 to 3 weeks for skills verification, EVL drafts, attorney review, and PWD request submission.' },
      { q: 'What makes an EVL useful?', a: ['Specific dates, duties, hours, and skills', 'Only a personal recommendation', 'A copy of a tourist visa', 'A list of hobbies'], correct: 0, explain: 'Specific employment facts help counsel prove the worker met the job requirements.' },
      { q: 'Who is responsible for getting the EVLs signed by former managers?', a: ['You, the sponsored employee', 'The Department of Labor', 'USCIS', 'Your current manager at the sponsoring employer'], correct: 0, explain: 'You must chase former managers for signatures and return the signed EVLs so the case can move into recruitment.' }
    ]
  },
  {
    id: 'ch3',
    phaseId: 'p3',
    title: 'Phase 3: PWD from DOL + Signed EVLs',
    icon: '⏳',
    description: 'Why the prevailing wage wait is slow and how signed experience letters support the future filing.',
    content: `<p>Phase 3 is mostly waiting, but it is not empty. The Department of Labor reviews the prevailing wage request and returns a wage level for the job. At the same time, the employee and counsel work to finalize signed EVLs so the file is ready for recruitment and eventual PERM filing.</p>
<h3>Why the DOL wait takes months</h3>
<p>PWD timing depends on agency workload, review queues, and whether the request is straightforward. A wage analyst compares the offered job to occupational classifications, duties, requirements, and location. Small wording differences can affect the result, so the employer and attorney try to submit a careful request the first time.</p>
<p>If the PWD comes back higher than expected, the employer and counsel review options. They may accept the wage if the business can support it, consider whether a redetermination is appropriate, or reassess the job details for a future strategy. Employees should avoid assuming that a higher wage automatically ends the case, but it can require internal review.</p>
<div class="info-card accent"><p><strong>Tracker estimate:</strong> This phase is set at 6 to 8 months. The exact timing can change as DOL processing times change.</p></div>
<ul><li><strong>Do:</strong> keep following up on unsigned EVLs through the normal attorney process.</li><li><strong>Do not:</strong> independently revise duties or requirements outside counsel's instructions.</li></ul>
<p>A clean PWD and signed EVLs help the case move efficiently into recruitment.</p>`,
    quiz: [
      { q: 'What is the estimated duration for Phase 3?', a: ['6 to 8 months', '1 to 2 weeks', '15 days', '0 months'], correct: 0, explain: 'The source timeline estimates 6 to 8 months to obtain the PWD and signed EVLs.' },
      { q: 'Who issues the prevailing wage determination?', a: ['U.S. Department of Labor', 'U.S. Department of State', 'The employee manager', 'The county tax office'], correct: 0, explain: 'The Department of Labor issues the PWD for PERM cases.' },
      { q: 'What can happen if the PWD is higher than expected?', a: ['The employer and counsel may review wage support or strategy', 'The green card is automatically approved', 'The employee must file I-485 immediately', 'The priority date disappears forever'], correct: 0, explain: 'A higher wage can require business and legal review before the case continues.' },
      { q: 'What should signed EVLs support?', a: ['That the employee met the offered job requirements', 'That recruitment ads ran for 30 days', 'That the green card was printed', 'That the Visa Bulletin is current'], correct: 0, explain: 'EVLs document prior experience or skills needed for the PERM role.' }
    ]
  },
  {
    id: 'ch4',
    phaseId: 'p4',
    title: 'Phase 4: Labor Market Test + PERM Prep',
    icon: '📢',
    description: 'How recruitment works, why the 30-day wait matters, and how the PERM record is built.',
    content: `<p>Once the PWD is in hand, the employer conducts the PERM labor market test. Recruitment is designed to test whether there are qualified U.S. workers available for the offered role at the required wage. The rules are detailed, so employers typically coordinate closely with immigration counsel and recruiting teams.</p>
<h3>Round of recruitment: a quarterly cadence</h3>
<p>Large employers like Microsoft typically test the labor market once per quarter. That means when your PWD and signed EVLs are in hand, your case is placed in the next available round of recruitment rather than starting immediately. This queuing effect is a real reason Phase 4 spans 3 to 5 months instead of 3 to 5 weeks: you may sit briefly waiting for the next cycle to open, then the cycle itself takes months to run.</p>
<h3>Common recruitment steps</h3>
<p>For professional positions, recruitment can include a state workforce agency job order, newspaper advertisements, internal posting, and additional professional recruitment steps such as a company website posting, job search website, employee referral program, campus placement, or local publication. The exact mix depends on the role and legal guidance.</p>
<p>After recruitment ends, the employer must observe a mandatory quiet period before filing. This is often described as the 30-day wait. During and after recruitment, the employer reviews applicants against the job's minimum requirements. The PERM case can proceed only if there is no able, willing, qualified, and available U.S. worker for the offered position.</p>
<div class="key-terms"><h3>Key Terms</h3><dl><dt>Labor Market Test</dt><dd>The required recruitment process used to test the availability of qualified U.S. workers.</dd><dt>Recruitment Report</dt><dd>The employer's documentation of recruitment steps, applicants, lawful reasons for rejection, and results.</dd></dl></div>
<p>Phase 4 is estimated at 3 to 5 months because ads must run, applicants must be considered, the waiting period must pass, and counsel must prepare the PERM filing package.</p>`,
    quiz: [
      { q: 'What is the goal of the PERM labor market test?', a: ['To determine whether qualified U.S. workers are available for the role', 'To renew the employee passport', 'To pick an interview date at USCIS', 'To replace the PWD'], correct: 0, explain: 'PERM recruitment tests the U.S. labor market for the offered job.' },
      { q: 'What is the estimated length of Phase 4?', a: ['3 to 5 months', '3 to 4 weeks', '6 to 8 months', '10 to 13 years'], correct: 0, explain: 'The source timeline sets labor market test and PERM preparation at 3 to 5 months.' },
      { q: 'What is the commonly referenced quiet period after recruitment?', a: ['30 days', '15 days', '6 months', '5 years'], correct: 0, explain: 'A 30-day wait after recruitment is part of the PERM timing structure.' },
      { q: 'When can the employer proceed toward PERM filing after recruitment?', a: ['When no able, willing, qualified, and available U.S. worker is found', 'When any applicant applies', 'Only after the green card is issued', 'Only if the employee changes jobs'], correct: 0, explain: 'PERM can proceed only if recruitment does not identify a qualified available U.S. worker.' },
      { q: 'How often does a large employer like Microsoft typically test the labor market?', a: ['About once per quarter', 'Every 30 days', 'Once per week', 'Only after the green card is approved'], correct: 0, explain: 'Recruitment rounds usually run on a quarterly cadence, so your case queues for the next open cycle.' }
    ]
  },
  {
    id: 'ch5',
    phaseId: 'p5',
    title: 'Phase 5: PERM Filing',
    icon: '📤',
    description: 'What Form ETA 9089 does, how audits work, and why certification creates the priority date.',
    content: `<p>PERM filing is the moment the employer submits Form ETA 9089 to the Department of Labor. The form summarizes the offered job, recruitment steps, prevailing wage, employer details, and the sponsored worker's qualifying background. The employee does not self-petition in a standard employer-sponsored PERM case. The employer owns the labor certification filing.</p>
<h3>Processing and audits</h3>
<p>Preparation and filing of Form ETA 9089 itself only takes about 1 to 2 weeks once Phase 4 is done. The rest of Phase 5 is DOL processing after filing, which has been long recently. This tracker uses 14 to 18 months for the total phase because the Department of Labor does not publish processing times and the queue is not trackable. Some cases are reviewed and certified without audit. Others are audited, meaning DOL asks for supporting documents such as recruitment proof, resumes received, lawful rejection reasons, business necessity materials, or signed declarations. <strong>If the case is audited, the employer must respond within 30 days,</strong> which counsel and Microsoft will coordinate on your behalf. An audit can add substantial time to certification.</p>
<p>Because U.S. regulations restrict how much the sponsored employee can be involved during this window, expect long gaps between updates from your immigration team. Silence usually means the case is sitting in a DOL queue, not that anything is wrong.</p>
<p>A certified PERM does not by itself grant permanent residence, work authorization, or travel permission. It is a required labor certification that allows the employer to file the I-140 immigrant petition in many EB-2 and EB-3 cases.</p>
<div class="info-card"><p><strong>Priority date:</strong> For a PERM-based case, the priority date is generally the date the PERM labor certification was filed. That date controls your place in the visa number line.</p></div>
<ul><li><strong>Certified:</strong> DOL approved the labor certification.</li><li><strong>Denied:</strong> DOL did not approve it, subject to legal strategy and possible review.</li><li><strong>Audited:</strong> DOL requested more documentation before deciding.</li></ul>`,
    quiz: [
      { q: 'Which form is filed for the PERM labor certification?', a: ['Form ETA 9089', 'Form I-485', 'Form I-765', 'Form N-400'], correct: 0, explain: 'Form ETA 9089 is the PERM labor certification application.' },
      { q: 'What is the tracker estimate for PERM processing in Phase 5?', a: ['14 to 18 months', '1 to 2 weeks', '15 days', '0 to 0.5 years'], correct: 0, explain: 'The requested baseline uses 14 to 18 months for PERM filing and processing.' },
      { q: 'What does a certified PERM allow the employer to do next in many cases?', a: ['File the I-140 immigrant petition', 'Print the green card', 'Skip the Visa Bulletin forever', 'Issue a passport'], correct: 0, explain: 'PERM certification supports the later I-140 filing.' },
      { q: 'What is generally the priority date in a PERM-based case?', a: ['The PERM filing date', 'The employee birth date', 'The date the green card arrives', 'The date of first H-1B approval'], correct: 0, explain: 'The PERM filing date usually establishes the priority date for PERM-based cases.' },
      { q: 'What does a DOL audit mean?', a: ['DOL asks for supporting documentation before deciding', 'The case is automatically denied', 'USCIS has scheduled an interview', 'The employee must leave the U.S.'], correct: 0, explain: 'An audit is a document request and review step, not an automatic denial.' },
      { q: 'How long does the employer have to respond to a DOL PERM audit?', a: ['30 days', '30 minutes', '6 months', '2 years'], correct: 0, explain: 'The employer must submit the audit response to DOL within a 30-day deadline.' }
    ]
  },
  {
    id: 'ch6',
    phaseId: 'p6',
    title: 'Phase 6: I-140 Immigrant Petition',
    icon: '📮',
    description: 'How the employer petition moves to USCIS and what premium processing and AC21 portability mean.',
    content: `<p>After PERM certification, the employer files Form I-140, Immigrant Petition for Alien Workers, with USCIS. The I-140 asks USCIS to classify the worker in the requested employment-based category, such as EB-2 or EB-3, and to confirm that the employer can pay the offered wage. The certified PERM, evidence of the employee's qualifications, and employer financial evidence support the filing.</p>
<h3>Regular versus premium processing</h3>
<p>Regular processing can take months, so this tracker uses 4 to 8 months. Many I-140 categories allow premium processing for an additional government fee, with a 15-day processing window represented here as 0.5 months. Premium processing speeds the I-140 decision, but it does not make a backlogged priority date current.</p>
<div class="info-card"><p><strong>Concurrent I-485 filing:</strong> If your priority date is already current on the Visa Bulletin at the time the I-140 is filed or approved, counsel can file your Adjustment of Status (I-485) at the same time. For most Rest of World nationals in EB-2 or EB-3 that is the common path. For India and China, the priority date usually will not be current at this point, and Phase 7 kicks in instead.</p></div>
<div class="info-card accent"><p><strong>Portability concept:</strong> AC21 rules can help some employees change jobs after an I-140 is approved and an I-485 has been pending at least 180 days, if the new role is in the same or similar occupational classification. Company policy and legal advice matter.</p></div>
<p>I-140 approval is a major milestone because it confirms the immigrant petition. It still may not mean you can file the final green card application if the Visa Bulletin is backlogged for your category and chargeability country. Keep the approval notice and receipt details handy because later steps often ask for petition history.</p>`,
    quiz: [
      { q: 'Which agency decides Form I-140?', a: ['USCIS', 'Department of Labor', 'Department of State only', 'State workforce agency'], correct: 0, explain: 'USCIS adjudicates the I-140 immigrant petition.' },
      { q: 'What does premium processing change for I-140?', a: ['It speeds the I-140 decision window', 'It removes per-country visa caps', 'It certifies recruitment', 'It grants citizenship'], correct: 0, explain: 'Premium processing accelerates the petition decision but does not fix visa backlogs.' },
      { q: 'What premium processing duration is represented in this tracker?', a: ['0.5 months, about 15 days', '6 to 8 months', '5 years', '0 years for all cases'], correct: 0, explain: 'Phase 6 includes premiumMonths: 0.5 to represent roughly 15 days.' },
      { q: 'What does an approved I-140 generally confirm?', a: ['The immigrant petition classification and supporting eligibility', 'That the green card has already been mailed', 'That no I-485 is ever needed', 'That the employee has become a U.S. citizen'], correct: 0, explain: 'I-140 approval confirms the immigrant petition, not final permanent residence.' },
      { q: 'What is one AC21 portability concept mentioned here?', a: ['Certain job changes may be possible after I-140 approval and 180 days of pending I-485', 'Any employee can change to any job before PERM', 'Premium processing creates automatic portability', 'Portability applies only to tourist visas'], correct: 0, explain: 'AC21 can support same or similar job portability after specific I-140 and I-485 milestones.' },
      { q: 'When can the I-485 typically be filed concurrently with the I-140?', a: ['When the priority date is already current on the Visa Bulletin', 'Only after the green card is mailed', 'Only if the employee is a U.S. citizen', 'Only during a DOL audit'], correct: 0, explain: 'When the priority date is current at I-140 time, counsel can file the I-485 concurrently. That is common for Rest of World nationals but rare for India and China.' }
    ]
  },
  {
    id: 'ch7',
    phaseId: 'p7',
    title: 'Phase 7: Priority Date Wait + The Visa Bulletin',
    icon: '🗓️',
    description: 'How the Visa Bulletin controls when a backlogged employee can move to the final green card step.',
    content: `<p>The priority date wait is where timelines diverge the most. Your priority date is your place in line for an immigrant visa number. Each month, the Department of State publishes the Visa Bulletin, which shows whether people in each employment-based category and chargeability country may move forward.</p>
<h3>Final Action Dates and Dates for Filing</h3>
<p>The Visa Bulletin has two important charts. <strong>Final Action Dates</strong> show when a green card can be finally approved because a visa number is available. <strong>Dates for Filing</strong> can sometimes allow applicants to submit I-485 paperwork earlier, depending on USCIS instructions for that month. Filing early can be valuable because it may unlock employment authorization and advance parole while the I-485 is pending.</p>
<p>Chargeability is usually based on country of birth. India and China are heavily backlogged because demand is high and per-country caps limit how many visas can be issued each year to one country. Rest of World, Mexico, and the Philippines can be current or have shorter waits, but the Visa Bulletin can move forward, stall, or retrogress.</p>
<div class="key-terms"><h3>Key Terms</h3><dl><dt>Priority Date</dt><dd>Your place in the immigrant visa line, usually the PERM filing date for PERM-based cases.</dd><dt>Retrogression</dt><dd>A backward movement in the Visa Bulletin that can make previously current dates unavailable.</dd></dl></div>
<p>This tracker uses country and category estimates for mid-2026, but the official monthly Visa Bulletin controls real eligibility.</p>`,
    quiz: [
      { q: 'What document is checked to see whether a priority date is current?', a: ['The monthly Visa Bulletin', 'The newspaper recruitment ad', 'The W-2 form', 'The passport photo page'], correct: 0, explain: 'The Visa Bulletin controls visa number availability by category and chargeability country.' },
      { q: 'What do Final Action Dates indicate?', a: ['When a green card can be finally approved if otherwise eligible', 'When the employer must post an internal notice', 'When the PWD expires for every case', 'When citizenship is automatic'], correct: 0, explain: 'Final Action Dates show when visa numbers are available for final approval.' },
      { q: 'Why are India and China often backlogged?', a: ['High demand combined with per-country caps', 'Their I-140 forms are never premium eligible', 'They are excluded from employment-based visas', 'Their PERM cases do not get priority dates'], correct: 0, explain: 'Demand and annual per-country limits create long waits.' },
      { q: 'What is retrogression?', a: ['Backward movement of cutoff dates', 'A shorter PWD review', 'A guaranteed approval notice', 'A way to skip recruitment'], correct: 0, explain: 'Retrogression happens when cutoff dates move backward or become less favorable.' },
      { q: 'What country usually determines chargeability?', a: ['Country of birth', 'Country of current residence', 'Country of current manager', 'Country where the laptop was issued'], correct: 0, explain: 'Chargeability is usually tied to birth country, subject to limited exceptions.' }
    ]
  },
  {
    id: 'ch8',
    phaseId: 'p8',
    title: 'Phase 8: I-485 or Consular Processing',
    icon: '🧾',
    description: 'The final application stage through adjustment of status in the U.S. or consular processing abroad.',
    content: `<p>When the priority date is eligible, the employee can move to the final permanent residence application stage. People inside the United States often use adjustment of status by filing Form I-485 with USCIS. People outside the United States, or some people choosing an embassy route, may use consular processing through the Department of State.</p>
<h3>Adjustment of status</h3>
<p>An I-485 package can include forms for employment authorization and advance parole. These benefits, often called EAD and AP, can provide work and travel flexibility while the I-485 is pending, although employees should follow company and attorney guidance before using them. USCIS may also require biometrics, a medical exam on Form I-693, updated evidence, and sometimes an interview.</p>
<h3>Consular processing</h3>
<p>Consular processing usually involves National Visa Center document collection, civil documents, fees, and an interview at a U.S. consulate. After approval and U.S. entry with the immigrant visa, permanent residence begins and the physical card follows.</p>
<div class="info-card"><p><strong>Tracker estimate:</strong> Phase 8 is set at 6 to 18 months. Local USCIS field office timing, consulate capacity, security checks, medical exam timing, and requests for evidence can affect the range.</p></div>
<ul><li><strong>I-485:</strong> Green card application filed with USCIS from inside the United States.</li><li><strong>EAD:</strong> Employment authorization document.</li><li><strong>AP:</strong> Advance parole travel document.</li></ul>`,
    quiz: [
      { q: 'Which form is used for adjustment of status?', a: ['Form I-485', 'Form ETA 9089', 'Form N-400', 'Form DS-160 only'], correct: 0, explain: 'Form I-485 is the adjustment of status application.' },
      { q: 'What is the Phase 8 estimated duration?', a: ['6 to 18 months', '1 to 2 weeks', '14 to 18 years', '0 days'], correct: 0, explain: 'The tracker uses 6 to 18 months for I-485 or consular processing.' },
      { q: 'What benefits may be requested during I-485 pendency?', a: ['EAD and advance parole', 'A PERM audit and PWD', 'Citizenship and a passport', 'A new priority date only'], correct: 0, explain: 'Adjustment applicants often request employment authorization and advance parole.' },
      { q: 'What is Form I-693 related to?', a: ['The medical exam', 'The labor certification', 'The I-140 premium fee', 'The Visa Bulletin'], correct: 0, explain: 'Form I-693 documents the immigration medical exam.' },
      { q: 'Which route commonly uses a U.S. consulate interview abroad?', a: ['Consular processing', 'PWD redetermination', 'Internal job posting', 'AC21 portability'], correct: 0, explain: 'Consular processing completes the immigrant visa step through a consulate.' }
    ]
  },
  {
    id: 'ch9',
    phaseId: 'p9',
    title: 'Phase 9: Green Card Issued',
    icon: '🎉',
    description: 'What permanent residence means once the card is approved and how travel and renewals work.',
    content: `<p>Green card issuance is the terminal milestone in this tracker. For adjustment of status cases, USCIS approves the I-485 and mails the physical card. For consular processing cases, the person becomes a lawful permanent resident when admitted to the United States with the immigrant visa, and the card is produced afterward.</p>
<h3>The card and the status</h3>
<p>The plastic card is usually valid for 10 years, but lawful permanent resident status is not the same as the card expiration date. A card must be renewed, while the underlying status continues unless abandoned, rescinded, or removed through legal process. Keep copies of approval notices, immigrant visa packets where applicable, and card images in a secure place.</p>
<div class="info-card accent"><p><strong>Travel reminder:</strong> Permanent residents can travel internationally, but long or repeated trips can raise questions about whether the U.S. remains the real home. A re-entry permit may help for planned long absences.</p></div>
<p>Many employment-based permanent residents become eligible to apply for naturalization after five years as lawful permanent residents, assuming they meet residence, physical presence, good moral character, English, civics, and other requirements. Citizenship is not automatic. It requires filing Form N-400 and completing the naturalization process.</p>
<ul><li><strong>Keep:</strong> address updated with USCIS when required.</li><li><strong>Plan:</strong> international travel and re-entry documents carefully.</li><li><strong>Track:</strong> the five-year naturalization window if citizenship is a goal.</li></ul>`,
    quiz: [
      { q: 'What is the terminal phase in this tracker?', a: ['Green Card Issued', 'PERM Assessment', 'PWD Request', 'Labor Market Test'], correct: 0, explain: 'Phase 9 is marked as the terminal green card issued state.' },
      { q: 'How long is a typical adult green card card validity period?', a: ['10 years', '15 days', '6 months', '1 week'], correct: 0, explain: 'The physical green card is commonly valid for 10 years.' },
      { q: 'What form is used to apply for naturalization?', a: ['Form N-400', 'Form ETA 9089', 'Form I-140', 'Form I-693'], correct: 0, explain: 'Form N-400 is the naturalization application.' },
      { q: 'After how many years do many employment-based LPRs become eligible to apply for citizenship?', a: ['5 years', '30 days', '14 months', '18 years'], correct: 0, explain: 'Many LPRs can apply after five years if all requirements are met.' },
      { q: 'What can help with a planned long absence from the United States?', a: ['A re-entry permit', 'A newspaper ad', 'A PWD', 'An expired passport'], correct: 0, explain: 'A re-entry permit can support certain long planned trips, though it does not guarantee admission.' }
    ]
  },
  {
    id: 'ch10',
    phaseId: null,
    title: 'After the Green Card: Life as an LPR',
    icon: '🛂',
    description: 'Rights, responsibilities, tax residence, travel habits, and citizenship planning after approval.',
    content: `<p>Lawful permanent residence brings stability, but it also brings ongoing responsibilities. LPRs can generally live and work permanently in the United States, accept most jobs, attend school, own property, and sponsor certain family members. They must also obey immigration rules, keep required documents current, and treat the United States as their permanent home.</p>
<h3>Maintaining residence</h3>
<p>Extended international trips are one of the most common pitfalls. A single trip of more than six months can invite questions, and a trip of one year or more can create serious problems without proper planning. Keep evidence of U.S. ties such as home, job, tax filings, family, bank accounts, and community life. File U.S. taxes correctly, because permanent residents are generally treated as U.S. tax residents on worldwide income.</p>
<div class="key-terms"><h3>Key Terms</h3><dl><dt>LPR</dt><dd>Lawful permanent resident, the immigration status commonly proven by a green card.</dd><dt>Abandonment</dt><dd>A finding that a permanent resident no longer intended the United States to be the permanent home.</dd><dt>Naturalization</dt><dd>The process of applying to become a U.S. citizen, usually through Form N-400.</dd></dl></div>
<p>If citizenship is a goal, start tracking the five-year window, physical presence, continuous residence, selective service history if relevant, taxes, and travel dates. Common avoidable mistakes include staying abroad too long without advice, failing to renew documents, ignoring address update rules, or assuming old immigration issues no longer matter.</p>`,
    quiz: [
      { q: 'What does LPR stand for?', a: ['Lawful permanent resident', 'Labor posting record', 'Legal passport renewal', 'Local processing receipt'], correct: 0, explain: 'LPR means lawful permanent resident, the status commonly proven by a green card.' },
      { q: 'Which behavior can create residence concerns for an LPR?', a: ['Long or repeated trips abroad without planning', 'Keeping a U.S. home', 'Filing U.S. taxes correctly', 'Tracking travel dates'], correct: 0, explain: 'Extended absences can raise abandonment and continuous residence questions.' },
      { q: 'How are permanent residents generally treated for U.S. tax purposes?', a: ['As U.S. tax residents on worldwide income', 'As tourists with no tax filing duties', 'As tax residents only after citizenship', 'As exempt from all income tax'], correct: 0, explain: 'LPRs are generally U.S. tax residents and should get tax advice for complex facts.' },
      { q: 'What should someone track if planning for citizenship?', a: ['Travel dates, physical presence, residence, taxes, and eligibility timing', 'Only the card color', 'Only the I-140 receipt number', 'Only newspaper ad dates'], correct: 0, explain: 'Naturalization eligibility depends on several residence, presence, and conduct requirements.' },
      { q: 'What is abandonment in the green card context?', a: ['A finding that the U.S. is no longer the person\'s permanent home', 'The normal card renewal process', 'The same thing as premium processing', 'A requirement to restart recruitment every year'], correct: 0, explain: 'Abandonment concerns whether the permanent resident intended to keep the United States as home.' }
    ]
  }
];

const LEVELS = [
  { minXP: 0, name: 'New Hire', icon: '🌱' },
  { minXP: 100, name: 'PERM Prepper', icon: '📝' },
  { minXP: 250, name: 'Priority Date Watcher', icon: '🗓️' },
  { minXP: 500, name: 'Green Card Ready', icon: '🎫' },
  { minXP: 800, name: 'Immigration Nerd', icon: '🧭' }
];

