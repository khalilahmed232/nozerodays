package com.repo;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.entity.ActivityLog;

@Repository
public interface ActivityRepo extends JpaRepository<ActivityLog, Long> {
	List<ActivityLog> findByCreatedDateBetween(Date creationTimeStart, Date creationTimeEnd);

	@Query("select a from ActivityLog a where a.createdDate >= :creationTimeStart and a.createdDate <= :creationTimeEnd and a.actGroup.id = :act_group_id")
	List<ActivityLog> findCompletedActForActGroup(@Param("creationTimeStart") Date creationTimeStart,
			@Param("creationTimeEnd") Date creationTimeEnd, @Param("act_group_id") Long act_group_id);
}
