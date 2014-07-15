import sys
import os
import nltk
from nltk.tokenize import RegexpTokenizer
import math
from nltk.corpus import reuters

class tfidf:
    
    def __init__(self):
        self.weighted = False
        self.stopwords = nltk.corpus.stopwords.words('english')
       
        self.sampleWords = []
        
        
        self.vocabulary = []
        
        
        self.docs = {}
        
        
        self.all_tips = []
        self.words = []
    
    
    def freq(self,word, doc):
        return doc.count(word)
    
    def word_count(self,doc):
        return len(doc)
    
    def tf(self,word, doc):
        return (self.freq(word, doc) / float(self.word_count(doc)))
    
    def num_docs_containing(self,word, list_of_docs):
        count = 0
        for document in list_of_docs:
            if self.freq(word, document) > 0:
                count += 1
        return 1 + count
        
    def idf(self,word, list_of_docs):
        return math.log(len(list_of_docs) / float(self.num_docs_containing(word, list_of_docs)))
    
    def tf_idf(self,word, doc, list_of_docs):
        return (self.tf(word, doc) * self.idf(word, list_of_docs))
#     def set_sample_words(sample_doc):
#         tokens = tokenizer.tokenize(sample_doc)
#         
#         bi_tokens = bigrams(tokens)
#         tri_tokens = trigrams(tokens)
#         
#         tokens = [token.lower() for token in tokens if len(token) > 2]
#         tokens = [token for token in tokens if token not in stopwords]
#  
#         bi_tokens = [' '.join(token).lower() for token in bi_tokens]
#         bi_tokens = [token for token in bi_tokens if token not in stopwords]
#  
#         tri_tokens = [' '.join(token).lower() for token in tri_tokens]
#         tri_tokens = [token for token in tri_tokens if token not in stopwords]
        
        
        

    
    def get_tf_idf(self,sample_doc,corpus_list):
        for tip in corpus_list:
            
            tokens =  nltk.word_tokenize(reuters.raw(tip))

            
            bi_tokens = nltk.bigrams(tokens)
            tri_tokens = nltk.trigrams(tokens)
            
            tokens = [token.lower() for token in tokens if len(token) > 2]
            tokens = [token for token in tokens if token not in self.stopwords]
            
            bi_tokens = [' '.join(token).lower() for token in bi_tokens]
            bi_tokens = [token for token in bi_tokens if token not in self.stopwords]
         
            tri_tokens = [' '.join(token).lower() for token in tri_tokens]
            tri_tokens = [token for token in tri_tokens if token not in self.stopwords]
         
            final_tokens = []
            final_tokens.extend(tokens)
            final_tokens.extend(bi_tokens)
            final_tokens.extend(tri_tokens)
            self.docs[tip] = {'freq': {}, 'tf': {}, 'idf': {},
                                'tf-idf': {}, 'tokens': []}
         
            for token in final_tokens:
                #The frequency computed for each tip
                self.docs[tip]['freq'][token] = self.freq(token, final_tokens)
                #The term-frequency (Normalized Frequency)
                self.docs[tip]['tf'][token] = self.tf(token, final_tokens)
                
                self.docs[tip]['tokens'] = final_tokens
     
            self.vocabulary.append(final_tokens)
            
            print 'vocabulary size is {0}'.format(len(self.vocabulary));
            #print 'haha'
        #print self.vocabulary       
        
        x = 0;     
        for doc in self.docs:
            for token in self.docs[doc]['tf']:
                #The Inverse-Document-Frequency
                self.docs[doc]['idf'][token] = self.idf(token, self.vocabulary)
                #The tf-idf
                self.docs[doc]['tf-idf'][token] = self.tf_idf(token, self.docs[doc]['tokens'], self.vocabulary)
                #x = x + 1
            print 'Current iteration is {0}'.format(x)
        
        words  = {};
        for doc in self.docs:
            for token in self.docs[doc]['tf-idf']:
                if token not in words:
                    words[token] = self.docs[doc]['tf-idf'][token]
                else:
                    if self.docs[doc]['tf-idf'][token] > words[token]:
                        words[token] = self.docs[doc]['tf-idf'][token]
         
            
            for token in self.docs[doc]['tf-idf']:
                print token, self.docs[doc]['tf-idf'][token]
                
        for item in sorted(words.items(), key=lambda x: x[1], reverse=True):
            print "%f <= %s" % (item[1], item[0])    
                
                
t = tfidf();
t.get_tf_idf(reuters.abspath('training/9995'),reuters.fileids());





