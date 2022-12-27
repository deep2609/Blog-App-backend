class ApiFeatures{
    constructor(query,queryStr){
        this.query = query,
        this.queryStr = queryStr
    }

    search(){
       const keyword = this.queryStr.keyword ? {
          title: {
             $regex: this.queryStr.keyword,
             $options: 'i'
          }
       } : {}

       this.query = this.query.find({...keyword});
       return this;
    }
    filter(){
      const category = this.queryStr.category ? {
         category : {
            $regex: this.queryStr.category,
            $options: 'i'
         }
      }: {}
      this.query = this.query.find({...category});
      return this;
    }
    orderBy(){
      let orderBy = {};

      if(!this.queryStr.orderBy){
         orderBy = {}
      }
      else if(this.queryStr.orderBy === "likes"){
         orderBy = {
            likesCount : -1
         }
      }
      else if(this.queryStr.orderBy === "comments"){
         orderBy = {
            commentsCount : -1
         }
      }
      else if(this.queryStr.orderBy === "date"){
         orderBy = {
            createdAt : -1
         }
      }
      else{
         orderBy = {}
      }
      this.query = this.query.find().sort({...orderBy});
      
      return this;
    }
    pagination(resultsPerPage){
      const currentPage = Number(this.queryStr.page) || 1;

      const skip = resultsPerPage * (currentPage - 1);
      this.query = this.query.limit(resultsPerPage).skip(skip);

      return this;
    }
}

module.exports = ApiFeatures;