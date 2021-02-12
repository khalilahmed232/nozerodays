package com.repo;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.entity.ActivityLog;

@Repository
public interface ActivityRepo extends JpaRepository<ActivityLog, Long>  {
	List<ActivityLog> findByCreatedDateBetween(
    	      Date creationTimeStart,
    	      Date creationTimeEnd);

}

