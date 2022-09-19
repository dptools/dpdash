const getCounts = ({ acl }) => {
  const options = [];
  for (let study = 0; study < acl.length; study++) {
    options.push(...acl[study].subjects);
  }
  return {
    // study determination: at least one upper case
    totalStudies: acl.filter(s=> /[A-Z]/.test(s.study)).length,
    // subject determination: at least 2 alpha and 3 numeric
    totalSubjects: options.filter(s=> {
      let alp=0
      let num=0

      for (let i=0; i<s.subject.length; i++) {
        /[a-zA-Z]/.test(s.subject[i]) && alp++;
        /[0-9]/.test(s.subject[i]) && num++;
      }

      return alp>=2 && num>=3 ? true : false
    }).length,
    totalDays: Math.max.apply(Math, options.map(function (o) { return o.days; }))
  };
}

export default getCounts;
