import React from 'react'
import HomeNav from './Components/HomeNav'
import { useProducts } from '../../hooks/useProducts';
import { useCollectionByHandle } from '../../hooks/useCollections';

const Home = () => {
  const { data: products, status, error } = useProducts(50);
  console.log(products);
  const { data: collections } = useCollectionByHandle(20);
  console.log(collections);


  return (
    <div>
      <HomeNav />
    </div>
  )
}

export default Home
