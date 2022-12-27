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

    textSearch(){
       const textSearch = this.queryStr.textSearch ? {
         content: {
            $regex: this.queryStr.textSearch,
            $options: 'i'
         }
       } : {}
       this.query = this.query.find({...textSearch});
       return this;
    }

    userFilter(){
        let userData = {};
        if(!this.queryStr.user){
         userData = {};
        }
        else{
          userData = {
            user : this.queryStr.user
          }
        }
        this.query = this.query.find({...userData});
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
      let type = this.queryStr.type || "desc";
      if(!this.queryStr.orderBy){
         orderBy = {}
      }
      else if(this.queryStr.orderBy === "likes"){
         orderBy = {
            likesCount : (type=="desc"?-1:1)
         }
      }
      else if(this.queryStr.orderBy === "comments"){
         orderBy = {
            commentsCount : (type=="desc"?-1:1)
         }
      }
      else if(this.queryStr.orderBy === "date"){
         orderBy = {
            createdAt : (type=="desc"?-1:1)
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