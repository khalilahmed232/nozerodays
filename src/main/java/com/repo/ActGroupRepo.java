package com.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.entity.ActGroup;

@Repository
public interface ActGroupRepo extends JpaRepository<ActGroup, Long>  {
	
}


